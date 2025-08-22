package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "orders")
data class OrderEntity(
    @PrimaryKey val id: Int = 0,
    val orderNumber: String,
    val userId: Int,
    val totalAmount: Double,
    val status: String = "pending",
    val paymentMethod: String? = null,
    val shippingAddress: String? = null,
    val billingAddress: String? = null,
    val createdAt: Date = Date()
)