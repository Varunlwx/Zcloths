package com.zeecloths.app.data.local.dao

import androidx.room.*
import com.zeecloths.app.data.local.entities.CartItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface CartDao {
    
    @Query("SELECT * FROM cart_items WHERE userId = :userId")
    fun getCartItems(userId: Int): Flow<List<CartItemEntity>>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCartItem(item: CartItemEntity)
    
    @Update
    suspend fun updateCartItem(item: CartItemEntity)
    
    @Delete
    suspend fun deleteCartItem(item: CartItemEntity)
    
    @Query("DELETE FROM cart_items WHERE userId = :userId")
    suspend fun clearCart(userId: Int)
    
    @Query("SELECT COUNT(*) FROM cart_items WHERE userId = :userId")
    suspend fun getCartItemCount(userId: Int): Int
}