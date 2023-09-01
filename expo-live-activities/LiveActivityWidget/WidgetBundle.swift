import SwiftUI
import WidgetKit

@main
struct LiveActivityWidgetBundle: WidgetBundle {
    var body: some Widget {
        if #available(iOS 16.2, *) {
            LiveActivityWidget()
        }
    }
}
