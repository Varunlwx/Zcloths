package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "order_items")
data class OrderItemEntity(
    @PrimaryKey val id: Int = 0,
    val orderId: Int,
    val productId: Int,
    val quantity: Int,
    val price: Double,
    val size: String? = null,
    val color: String? = null
)