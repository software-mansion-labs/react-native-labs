import ActivityKit
import WidgetKit
import SwiftUI

@available(iOS 16.2, *)
struct LiveActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: Attributes.self) { context in
            LockScreenLiveActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label(context.attributes.orderNumber, systemImage: "bag")
                        .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    Label {
                        Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                            .monospacedDigit()
                            .frame(maxWidth: .infinity, alignment: .center)
                    } icon: {
                        Image(systemName: "timer")
                    }
                    .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.center) {
                    Text("\(context.state.driverName) is on their way!")
                        .lineLimit(1)
                        .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.bottom) {
                    Button {
                        // Deep link into your app.
                    } label: {
                        Label("View Order", systemImage: "magnifyingglass")
                    }
                    .foregroundColor(.green)
                }
            } compactLeading: {
                Label {
                    Text(context.attributes.orderNumber)
                } icon: {
                    Image(systemName: "bag")
                }
            } compactTrailing: {
                context.state.isCompleted ? 
                    AnyView(Label {
                        Text("Delivered")
                    } icon: {
                        Image(systemName: "checkmark.circle.fill")
                    }) :
                    AnyView(Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                        .monospacedDigit()
                        .font(.caption))
            } minimal: {
                context.state.isCompleted ? 
                    AnyView(Label {
                        Text("Delivered")
                    } icon: {
                        Image(systemName: "checkmark.circle.fill")
                    }) :
                    AnyView(VStack(alignment: .center) {
                        Image(systemName: "timer")
                        Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                            .monospacedDigit()
                            .font(.caption)
                    })
            }
        }
    }
}

@available(iOS 16.2, *)
struct LockScreenLiveActivityView: View {
    let context: ActivityViewContext<Attributes>
    
    var body: some View {
        VStack {
            Spacer()
            Text("\(context.state.driverName) is on their way with your pizza!")
            Spacer()
            HStack {
                Spacer()
                Label {
                    Text(context.attributes.orderNumber)
                } icon: {
                    Image(systemName: "bag")
                        .foregroundColor(.indigo)
                }
                .font(.title2)
                Spacer()
                Label {
                    Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                        .multilineTextAlignment(.center)
                        .frame(width: 75)
                        .monospacedDigit()
                } icon: {
                    Image(systemName: "timer")
                        .foregroundColor(.indigo)
                }
                .font(.title2)
                Spacer()
            }
            Spacer()
        }
    }
}
