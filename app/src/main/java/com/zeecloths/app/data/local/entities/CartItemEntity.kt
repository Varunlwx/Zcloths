package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "cart_items")
data class CartItemEntity(
    @PrimaryKey val id: Int = 0,
    val productId: Int,
    val quantity: Int,
    val size: String? = null,
    val color: String? = null,
    val userId: Int
)