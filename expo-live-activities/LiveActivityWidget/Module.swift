import ExpoModulesCore
import ActivityKit

internal class UnableToCreateActivityException: Exception {
    override var reason: String {
        "Unable to create a Live Activity."
    }
}

internal class ActivityNotFound: Exception {
    override var reason: String {
        "Unable to find the Live Activity."
    }
}

public class ReactNativeWidgetExtensionModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ReactNativeWidgetExtension")
        
        Function("areActivitiesEnabled") { () -> Bool in
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("startActivity") { (totalAmount: String, orderNumber: String, driverName: String, minutes: Int, seconds: Int) -> String? in
            if #available(iOS 16.2, *) {
                let initialContentState = getContentState(driverName: driverName, minutes: minutes, seconds: seconds)
                let activityAttributes = Attributes(totalAmount: totalAmount, orderNumber: orderNumber)
                let activityContent = ActivityContent(state: initialContentState, staleDate: Calendar.current.date(byAdding: .minute, value: 30, to: Date())!)
                
                do {
                    return try Activity.request(attributes: activityAttributes, content: activityContent).id
                } catch {
                    throw UnableToCreateActivityException()
                }
            }

            return nil
        }
        
        Function("updateActivity") { (activityId: String, driverName: String, minutes: Int, seconds: Int) -> Void in
            if #available(iOS 16.2, *) {
                let updatedDeliveryStatus = getContentState(driverName: driverName, minutes: minutes, seconds: seconds)
                let alertConfiguration = AlertConfiguration(title: "Delivery update", body: "Your order order will arrive soon.", sound: .default)
                let updatedContent = ActivityContent(state: updatedDeliveryStatus, staleDate: nil)
                
                if let activity = Activity<Attributes>.activities.first(where: { $0.id == activityId }) {
                    Task {
                        await activity.update(updatedContent, alertConfiguration: alertConfiguration)
                    }
                } else {
                    throw ActivityNotFound()
                }
            }
        }
        
        Function("endActivity") { (activityId: String, driverName: String) -> Void in
            if #available(iOS 16.2, *) {
                let finalDeliveryStatus = Attributes.ContentState(driverName: driverName, deliveryTimer: Date.now...Date(), isCompleted: true)
                let finalContent = ActivityContent(state: finalDeliveryStatus, staleDate: nil)
                
                if let activity = Activity<Attributes>.activities.first(where: { $0.id == activityId }) {
                    Task {
                        await activity.end(finalContent, dismissalPolicy: .default)
                    }
                } else {
                    throw ActivityNotFound()
                }
            }
        }
    }
}

@available(iOS 16.1, *)
private func getContentState(driverName: String, minutes: Int, seconds: Int) -> Activity<Attributes>.ContentState {
    var endTime = Calendar.current.date(byAdding: .minute, value: (Int(minutes) ?? 0), to: Date())!
    endTime = Calendar.current.date(byAdding: .second, value: (Int(seconds) ?? 0), to: endTime)!
    let isCompleted = minutes == 0 && seconds == 0
    let date = isCompleted ? Date.now...Date.now : Date.now...endTime
    return Attributes.ContentState(driverName: driverName, deliveryTimer: date, isCompleted: isCompleted)
}