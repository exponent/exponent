require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'expo-dev-client'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platform       = :ios, '11.0'
  s.source         = { git: 'https://github.com/expo/expo.git' }
  s.header_dir     = 'EXDevClient'

  s.dependency 'expo-dev-launcher', :configurations => :debug
  s.dependency 'expo-dev-dev-menu', :configurations => :debug
  s.dependency 'expo-dev-menu-interface', :configurations => :debug
end
