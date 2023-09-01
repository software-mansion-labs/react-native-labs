import Foundation
import ActivityKit

struct Attributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var driverName: String
        var deliveryTimer: ClosedRange<Date>
        var isCompleted: Bool = false
    }
    
    var totalAmount: String
    var orderNumber: String
}
