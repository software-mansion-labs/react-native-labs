import LinkPresentation
import ExpoModulesCore

class LinkPreviewView: ExpoView {
    private var linkView: LPLinkView?
    
    let onLoad = EventDispatcher()
    let onStartLoading = EventDispatcher()
    
    required init(appContext: AppContext? = nil) {
        super.init(appContext: appContext)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func setURL(_ url: URL) {
        loadURLMetadata(url: url)
    }
    
    private func loadURLMetadata(url: URL) {
        let metadataProvider = LPMetadataProvider()
        onStartLoading()
        metadataProvider.startFetchingMetadata(for: url) { [weak self] (metadata, error) in
            guard let strongSelf = self else { return }
            
            if error != nil {
                return
            }
            
            guard let metadata = metadata else {
                return
            }
            
            strongSelf.onLoad()
            
            DispatchQueue.main.async {
                // Removes old LinkView if exists
                strongSelf.linkView?.removeFromSuperview()
                
                let linkView = LPLinkView(metadata: metadata)
                strongSelf.linkView = linkView
                strongSelf.addSubview(linkView)
                
                // You may adjust frame as per requirement, here it's set to fill whole view
                linkView.frame = strongSelf.bounds
            }
        }
    }
    
}

