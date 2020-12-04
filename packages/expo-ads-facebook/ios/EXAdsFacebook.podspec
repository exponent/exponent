require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

fb_audience_network_version = '~> 5.9.0'
using_custom_fb_audience_network_version = defined? $FBAudienceNetworkVersion
if using_custom_fb_audience_network_version
  fb_audience_network_version = $FBAudienceNetworkVersion
  Pod::UI.puts "expo-ads-facebook: Using user specified FBAudienceNetwork version '#{$fb_audience_network_version}'"
end

Pod::Spec.new do |s|
  s.name           = 'EXAdsFacebook'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platform       = :ios, '10.0'
  s.source         = { git: 'https://github.com/expo/expo.git' }

  s.dependency 'UMCore'
  s.dependency 'FBAudienceNetwork', fb_audience_network_version

  if !$ExpoUseSources&.include?(package['name']) && ENV['EXPO_USE_SOURCE'].to_i == 0 && File.exist?("#{s.name}.xcframework") && Gem::Version.new(Pod::VERSION) >= Gem::Version.new('1.10.0')
    s.source_files = "#{s.name}/**/*.h"
    s.vendored_frameworks = "#{s.name}.xcframework"
  else
    s.source_files = "#{s.name}/**/*.{h,m}"
  end
end
