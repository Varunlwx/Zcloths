package com.zeecloths.app.domain.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class CartItem(
    val id: Int = 0,
    val productId: Int,
    val productName: String,
    val productImage: String? = null,
    val productPrice: Double,
    val quantity: Int,
    val size: String? = null,
    val color: String? = null,
    val userId: Int
) : Parcelable