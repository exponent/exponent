/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#include "ABI41_0_0AndroidDialogPickerEventEmitter.h"
#include "ABI41_0_0AndroidDialogPickerProps.h"

#include <ABI41_0_0React/components/view/ConcreteViewShadowNode.h>

namespace ABI41_0_0facebook {
namespace ABI41_0_0React {

extern const char AndroidDialogPickerComponentName[];

/*
 * `ShadowNode` for <AndroidDialogPicker> component.
 */
using AndroidDialogPickerShadowNode = ConcreteViewShadowNode<
    AndroidDialogPickerComponentName,
    AndroidDialogPickerProps,
    AndroidDialogPickerEventEmitter>;

} // namespace ABI41_0_0React
} // namespace ABI41_0_0facebook
