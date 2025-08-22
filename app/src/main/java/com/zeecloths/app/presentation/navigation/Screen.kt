package com.zeecloths.app.presentation.navigation

sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Shop : Screen("shop")
    object ProductDetail : Screen("product_detail/{productId}") {
        fun createRoute(productId: Int) = "product_detail/$productId"
    }
    object Cart : Screen("cart")
    object Profile : Screen("profile")
    object Login : Screen("login")
    object Register : Screen("register")
    object About : Screen("about")
    object Contact : Screen("contact")
    object Search : Screen("search/{query}") {
        fun createRoute(query: String) = "search/$query"
    }
}