package com.zeecloths.app.data.local.entities

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.Date

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: Int = 0,
    val username: String,
    val email: String,
    val passwordHash: String,
    val firstName: String,
    val lastName: String,
    val phone: String? = null,
    val address: String? = null,
    val isAdmin: Boolean = false,
    val createdAt: Date = Date()
)