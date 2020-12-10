/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include <react/components/root/RootComponentDescriptor.h>
#include <react/components/scrollview/ScrollViewComponentDescriptor.h>
#include <react/components/text/ParagraphComponentDescriptor.h>
#include <react/components/text/RawTextComponentDescriptor.h>
#include <react/components/text/TextComponentDescriptor.h>
#include <react/components/view/ViewComponentDescriptor.h>
#include <react/element/ComponentBuilder.h>
#include <react/uimanager/ComponentDescriptorProviderRegistry.h>

namespace facebook {
namespace react {

inline ComponentBuilder simpleComponentBuilder() {
  ComponentDescriptorProviderRegistry componentDescriptorProviderRegistry{};
  auto eventDispatcher = EventDispatcher::Shared{};
  auto componentDescriptorRegistry =
      componentDescriptorProviderRegistry.createComponentDescriptorRegistry(
          ComponentDescriptorParameters{eventDispatcher, nullptr, nullptr});

  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<RootComponentDescriptor>());
  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<ViewComponentDescriptor>());
  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<ScrollViewComponentDescriptor>());
  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<ParagraphComponentDescriptor>());
  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<TextComponentDescriptor>());
  componentDescriptorProviderRegistry.add(
      concreteComponentDescriptorProvider<RawTextComponentDescriptor>());

  return ComponentBuilder{componentDescriptorRegistry};
}

} // namespace react
} // namespace facebook
