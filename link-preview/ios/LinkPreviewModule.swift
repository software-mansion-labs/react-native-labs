import ExpoModulesCore

public class LinkPreviewModule: Module {
    public func definition() -> ModuleDefinition {
        Name("LinkPreview")
        
        View(LinkPreviewView.self) {
            Events("onLoad", "onStartLoading")
            Prop("url") { (view: LinkPreviewView, prop: String) in
                print("!@#", prop)
                guard let url = URL(string: prop) else {
                    print("!@# url doesn't work!")
                    return
                }
                view.setURL(url)
            }
        }
    }
}
