package com.zeecloths.app.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Order(
    val id: Int = 0,
    val orderNumber: String,
    val userId: Int,
    val totalAmount: Double,
    val status: OrderStatus = OrderStatus.PENDING,
    val paymentMethod: String? = null,
    val shippingAddress: String? = null,
    val billingAddress: String? = null,
    val createdAt: Date = Date(),
    val items: List<OrderItem> = emptyList()
) : Parcelable

@Parcelize
data class OrderItem(
    val id: Int = 0,
    val orderId: Int,
    val productId: Int,
    val productName: String,
    val productImage: String? = null,
    val quantity: Int,
    val price: Double,
    val size: String? = null,
    val color: String? = null
) : Parcelable

enum class OrderStatus {
    PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
}