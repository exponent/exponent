// Copyright 2015-present 650 Industries. All rights reserved.

#import "EXSpeech.h"
#import <React/RCTEventEmitter.h>
#import <React/RCTEventDispatcher.h>

@interface EXSpeechUtteranceWithId : AVSpeechUtterance

@property (nonatomic) NSString* utteranceId;

- (instancetype)initWithString:(NSString *)string utteranceId:(NSString *)utteranceId;

@end

@implementation EXSpeechUtteranceWithId

- (instancetype)initWithString:(NSString *)string utteranceId:(NSString *)utteranceId
{
  self = [super initWithString:string];
  if (self) {
    _utteranceId = utteranceId;
  }
  return self;
}

@end

@interface EXSpeech ()

@property (nonatomic, strong) AVSpeechSynthesizer *synthesizer;

@end

@implementation EXSpeech

RCT_EXPORT_MODULE(ExponentSpeech)

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"Exponent.speakingStarted", @"Exponent.speakingDone", @"Exponent.speakingStopped", @"Exponent.speakingError"];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer
  didStartSpeechUtterance:(AVSpeechUtterance *)utterance
{
  [self sendEventWithName:@"Exponent.speakingStarted" body:@{ @"id": ((EXSpeechUtteranceWithId *) utterance).utteranceId }];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer
 didCancelSpeechUtterance:(AVSpeechUtterance *)utterance
{
  [self sendEventWithName:@"Exponent.speakingStopped" body:@{ @"id": ((EXSpeechUtteranceWithId *) utterance).utteranceId }];
}

- (void)speechSynthesizer:(AVSpeechSynthesizer *)synthesizer
 didFinishSpeechUtterance:(AVSpeechUtterance *)utterance
{
  [self sendEventWithName:@"Exponent.speakingDone" body:@{ @"id": ((EXSpeechUtteranceWithId *) utterance).utteranceId }];
}


  RCT_EXPORT_METHOD(speak:(nonnull NSString *)utteranceId text:(nonnull NSString *)text options:(NSDictionary *)options) {
    if (self.synthesizer == nil) {
      self.synthesizer = [[AVSpeechSynthesizer alloc] init];
      self.synthesizer.delegate = self;
    }
    
    AVSpeechUtterance *utterance = [[EXSpeechUtteranceWithId alloc] initWithString:text utteranceId:utteranceId];
    
    NSString *language = options[@"language"];
    NSNumber *pitch = options[@"pitch"];
    NSNumber *rate = options[@"rate"];
    
    if (language != nil) {
      utterance.voice = [AVSpeechSynthesisVoice voiceWithLanguage:language];
    }
    if (pitch != nil) {
      utterance.pitchMultiplier = [pitch floatValue];
    }
    if (rate != nil) {
      utterance.rate = [rate floatValue];
    }
    
    [self.synthesizer speakUtterance:utterance];
  }
  
  RCT_EXPORT_METHOD(stop) {
    [self.synthesizer stopSpeakingAtBoundary:AVSpeechBoundaryImmediate];
  }
  
  RCT_REMAP_METHOD(isSpeaking, resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    resolve([NSNumber numberWithBool:[self.synthesizer isSpeaking]]);
  }
  
  @end
  
