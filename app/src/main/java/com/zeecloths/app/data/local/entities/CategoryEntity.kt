package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey val id: Int = 0,
    val name: String,
    val description: String? = null,
    val imageUrl: String? = null
)