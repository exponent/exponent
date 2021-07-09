
public struct Promise: AnyMethodArgument {
  public typealias ResolveClosure = (Any?) -> Void
  public typealias RejectClosure = (String?, String?, Error?) -> Void

  public var resolver: ResolveClosure
  public var rejecter: RejectClosure

  public func resolve(_ value: Any? = nil) {
    resolver(value)
  }

  public func reject(_ code: String, _ description: String, _ error: Error? = nil) {
    rejecter(code, description, error)
  }

  public func reject(_ description: String, _ error: Error? = nil) {
    rejecter("ERR", description, error)
  }

  public func reject(_ error: Error) -> Void {
    rejecter("ERR", error.localizedDescription, error)
  }
}
