package com.zeecloths.app.data.local.dao

import androidx.room.*
import com.zeecloths.app.data.local.entities.OrderEntity
import com.zeecloths.app.data.local.entities.OrderItemEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface OrderDao {
    
    @Query("SELECT * FROM orders WHERE userId = :userId ORDER BY createdAt DESC")
    fun getOrdersByUser(userId: Int): Flow<List<OrderEntity>>
    
    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    fun getAllOrders(): Flow<List<OrderEntity>>
    
    @Query("SELECT * FROM orders WHERE id = :id")
    suspend fun getOrderById(id: Int): OrderEntity?
    
    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    suspend fun getOrderItems(orderId: Int): List<OrderItemEntity>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: OrderEntity): Long
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrderItems(items: List<OrderItemEntity>)
    
    @Update
    suspend fun updateOrder(order: OrderEntity)
    
    @Query("SELECT COUNT(*) FROM orders")
    suspend fun getOrderCount(): Int
    
    @Query("SELECT SUM(totalAmount) FROM orders")
    suspend fun getTotalRevenue(): Double?
}