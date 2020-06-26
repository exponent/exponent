// Copyright © 2018 650 Industries. All rights reserved.

#import <MessageUI/MessageUI.h>
#import <EXSMS/EXSMSModule.h>
#import <UMCore/UMUtilities.h>
#if SD_MAC
#import <CoreServices/CoreServices.h>
#else
#import <MobileCoreServices/MobileCoreServices.h>
#endif

@interface EXSMSModule () <MFMessageComposeViewControllerDelegate>

@property (nonatomic, weak) id<UMUtilitiesInterface> utils;
@property (nonatomic, strong) UMPromiseResolveBlock resolve;
@property (nonatomic, strong) UMPromiseRejectBlock reject;

@end

@implementation EXSMSModule

UM_EXPORT_MODULE(ExpoSMS);

- (dispatch_queue_t)methodQueue
{
  // Everything in this module uses `MFMessageComposeViewController` which is a subclass of UIViewController,
  // so everything should be called from main thread.
  return dispatch_get_main_queue();
}

- (void)setModuleRegistry:(UMModuleRegistry *)moduleRegistry
{
  _utils = [moduleRegistry getModuleImplementingProtocol:@protocol(UMUtilitiesInterface)];
}

UM_EXPORT_METHOD_AS(isAvailableAsync,
                    isAvailable:(UMPromiseResolveBlock)resolve
                    rejecter:(UMPromiseRejectBlock)reject)
{
  resolve(@([MFMessageComposeViewController canSendText]));
}

UM_EXPORT_METHOD_AS(sendSMSAsync,
                    sendSMS:(NSArray<NSString *> *)addresses
                    message:(NSString *)message
                    options:(NSDictionary *)options
                    resolver:(UMPromiseResolveBlock)resolve
                    rejecter:(UMPromiseRejectBlock)reject)
{
  if (![MFMessageComposeViewController canSendText]) {
    reject(@"E_SMS_UNAVAILABLE", @"SMS service not available", nil);
    return;
  }
  
  if (_resolve != nil || _reject != nil) {
    reject(@"E_SMS_SENDING_IN_PROGRESS", @"Different SMS sending in progress. Await the old request and then try again.", nil);
    return;
  }
  
  _resolve = resolve;
  _reject = reject;

  MFMessageComposeViewController *messageComposeViewController = [[MFMessageComposeViewController alloc] init];
  messageComposeViewController.messageComposeDelegate = self;
  messageComposeViewController.recipients = addresses;
  messageComposeViewController.body = message;
  
  if (options) {
    if (options[@"attachments"]) {
      NSArray *attachments = (NSArray *) [options objectForKey:@"attachments"];
      for (NSDictionary* attachment in attachments) {
        NSString *mimeType = attachment[@"mimeType"];
        CFStringRef mimeTypeRef = (__bridge CFStringRef)mimeType;
        CFStringRef utiRef = UTTypeCreatePreferredIdentifierForTag(kUTTagClassMIMEType, mimeTypeRef, NULL);
        if (utiRef == NULL) {
          reject(@"E_SMS_ATTACHMENT", [NSString stringWithFormat:@"Failed to find UTI for mimeType: %@", mimeType], nil);
          _resolve = nil;
          _reject = nil;
          return;
        }
        NSString *typeIdentifier = (__bridge_transfer NSString *)utiRef;
        NSString *uri = attachment[@"uri"];
        NSString *filename = attachment[@"filename"];
        NSError *error;
        NSData *attachmentData = [NSData dataWithContentsOfURL:[NSURL URLWithString:uri] options:(NSDataReadingOptions)0 error:&error];
        bool attached = [messageComposeViewController addAttachmentData:attachmentData typeIdentifier:typeIdentifier filename:filename];
        if (!attached) {
          reject(@"E_SMS_ATTACHMENT", [NSString stringWithFormat:@"Failed to attach file: %@", uri], nil);
          _resolve = nil;
          _reject = nil;
          return;
        }
      }
    }
  }

  [self.utils.currentViewController presentViewController:messageComposeViewController animated:YES completion:nil];
}

- (void)messageComposeViewController:(MFMessageComposeViewController *)controller
                 didFinishWithResult:(MessageComposeResult)result
{
  NSDictionary *resolveData;
  NSString *rejectMessage;
  switch (result) {
    case MessageComposeResultCancelled:
      resolveData = @{@"result": @"cancelled"};
      break;
    case MessageComposeResultSent:
      resolveData = @{@"result": @"sent"};
      break;
    case MessageComposeResultFailed:
      rejectMessage = @"User's attempt to save or send an SMS was unsuccessful. This can occur when the device loses connection to Wifi or Cellular.";
      break;
    default:
      rejectMessage = @"SMS message sending failed with unknown error";
      break;
  }
  UM_WEAKIFY(self);
  [controller dismissViewControllerAnimated:YES completion:^{
    UM_ENSURE_STRONGIFY(self);
    if (rejectMessage) {
      self->_reject(@"E_SMS_SENDING_FAILED", rejectMessage, nil);
    } else {
      self->_resolve(resolveData);
    }
    self->_reject = nil;
    self->_resolve = nil;
  }];
}
    
@end
