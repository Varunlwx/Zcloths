package com.zeecloths.app.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.Date

@Parcelize
data class Product(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val price: Double,
    val stock: Int = 0,
    val imageUrl: String? = null,
    val sizes: List<String> = emptyList(),
    val colors: List<String> = emptyList(),
    val categoryId: Int,
    val categoryName: String? = null,
    val createdAt: Date = Date()
) : Parcelable