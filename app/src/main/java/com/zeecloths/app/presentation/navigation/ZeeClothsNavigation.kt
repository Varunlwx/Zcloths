package com.zeecloths.app.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.zeecloths.app.presentation.screens.home.HomeScreen
import com.zeecloths.app.presentation.screens.shop.ShopScreen
import com.zeecloths.app.presentation.screens.product.ProductDetailScreen
import com.zeecloths.app.presentation.screens.cart.CartScreen
import com.zeecloths.app.presentation.screens.profile.ProfileScreen
import com.zeecloths.app.presentation.screens.auth.LoginScreen
import com.zeecloths.app.presentation.screens.auth.RegisterScreen
import com.zeecloths.app.presentation.screens.about.AboutScreen

@Composable
fun ZeeClothsNavigation(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Home.route
    ) {
        composable(Screen.Home.route) {
            HomeScreen(navController = navController)
        }
        
        composable(Screen.Shop.route) {
            ShopScreen(navController = navController)
        }
        
        composable(Screen.ProductDetail.route) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId")?.toIntOrNull() ?: 0
            ProductDetailScreen(
                productId = productId,
                navController = navController
            )
        }
        
        composable(Screen.Cart.route) {
            CartScreen(navController = navController)
        }
        
        composable(Screen.Profile.route) {
            ProfileScreen(navController = navController)
        }
        
        composable(Screen.Login.route) {
            LoginScreen(navController = navController)
        }
        
        composable(Screen.Register.route) {
            RegisterScreen(navController = navController)
        }
        
        composable(Screen.About.route) {
            AboutScreen(navController = navController)
        }
    }
}