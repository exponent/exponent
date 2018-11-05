// Copyright 2004-present Facebook. All Rights Reserved.

#pragma once

#include <fstream>
#include <memory>

#include <cxxReactABI26_0_0/ABI26_0_0JSBigString.h>
#include <cxxReactABI26_0_0/ABI26_0_0JSModulesUnbundle.h>

#ifndef RN_EXPORT
#define RN_EXPORT __attribute__((visibility("default")))
#endif

namespace facebook {
namespace ReactABI26_0_0 {

class RN_EXPORT JSIndexedRAMBundle : public JSModulesUnbundle {
public:
  static std::function<std::unique_ptr<JSModulesUnbundle>(std::string)> buildFactory();

  // Throws std::runtime_error on failure.
  JSIndexedRAMBundle(const char *sourceURL);

  // Throws std::runtime_error on failure.
  std::unique_ptr<const JSBigString> getStartupCode();
  // Throws std::runtime_error on failure.
  Module getModule(uint32_t moduleId) const override;

private:
  struct ModuleData {
    uint32_t offset;
    uint32_t length;
  };
  static_assert(
    sizeof(ModuleData) == 8,
    "ModuleData must not have any padding and use sizes matching input files");

  struct ModuleTable {
    size_t numEntries;
    std::unique_ptr<ModuleData[]> data;
    ModuleTable() : numEntries(0) {};
    ModuleTable(size_t entries) :
      numEntries(entries),
      data(std::unique_ptr<ModuleData[]>(new ModuleData[numEntries])) {};
    size_t byteLength() const {
      return numEntries * sizeof(ModuleData);
    }
  };

  std::string getModuleCode(const uint32_t id) const;
  void readBundle(char *buffer, const std::streamsize bytes) const;
  void readBundle(
    char *buffer, const
    std::streamsize bytes,
    const std::ifstream::pos_type position) const;

  mutable std::ifstream m_bundle;
  ModuleTable m_table;
  size_t m_baseOffset;
  std::unique_ptr<JSBigBufferString> m_startupCode;
};

}  // namespace ReactABI26_0_0
}  // namespace facebook
