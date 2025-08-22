package com.zeecloths.app.data.local.dao

import androidx.room.*
import com.zeecloths.app.data.local.entities.UserEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface UserDao {
    
    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserById(id: Int): UserEntity?
    
    @Query("SELECT * FROM users WHERE username = :username OR email = :username")
    suspend fun getUserByUsernameOrEmail(username: String): UserEntity?
    
    @Query("SELECT * FROM users WHERE email = :email")
    suspend fun getUserByEmail(email: String): UserEntity?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity): Long
    
    @Update
    suspend fun updateUser(user: UserEntity)
    
    @Delete
    suspend fun deleteUser(user: UserEntity)
    
    @Query("SELECT * FROM users WHERE isAdmin = 0")
    fun getAllCustomers(): Flow<List<UserEntity>>
    
    @Query("SELECT COUNT(*) FROM users WHERE isAdmin = 0")
    suspend fun getCustomerCount(): Int
}