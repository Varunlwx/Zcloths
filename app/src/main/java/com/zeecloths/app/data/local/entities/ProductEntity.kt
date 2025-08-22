package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "products")
data class ProductEntity(
    @PrimaryKey val id: Int = 0,
    val name: String,
    val description: String? = null,
    val price: Double,
    val stock: Int = 0,
    val imageUrl: String? = null,
    val sizes: List<String> = emptyList(),
    val colors: List<String> = emptyList(),
    val categoryId: Int,
    val createdAt: Date = Date()
)