#include "ABI39_0_0MutableValueSetterProxy.h"
#include "ABI39_0_0SharedParent.h"
#include "ABI39_0_0MutableValue.h"
#include <ABI39_0_0jsi/ABI39_0_0jsi.h>

using namespace ABI39_0_0facebook;

namespace ABI39_0_0reanimated {

void MutableValueSetterProxy::set(jsi::Runtime &rt, const jsi::PropNameID &name, const jsi::Value &newValue) {
  auto propName = name.utf8(rt);
  if (propName == "value") {
    // you call `this.value` inside of value setter, we should throw
  } else if (propName == "_value") {
    mutableValue->setValue(rt, newValue);
  } else if (propName == "_animation") {
    // TODO: assert to allow animation to be set from UI only
    mutableValue->animation = jsi::Value(rt, newValue);
  }
}

jsi::Value MutableValueSetterProxy::get(jsi::Runtime &rt, const jsi::PropNameID &name) {
  auto propName = name.utf8(rt);

  if (propName == "value") {
    return mutableValue->getValue(rt);
  } else if (propName == "_value") {
    return mutableValue->getValue(rt);
  } else if (propName == "_animation") {
    return jsi::Value(rt, mutableValue->animation);
  }

  return jsi::Value::undefined();
}

}

