package com.zeecloths.app.presentation.screens.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.zeecloths.app.R
import com.zeecloths.app.presentation.components.ZeeClothsTopBar
import com.zeecloths.app.presentation.navigation.Screen
import com.zeecloths.app.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    navController: NavController,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    Scaffold(
        topBar = {
            ZeeClothsTopBar(
                title = "ZEECLOTHS",
                navController = navController,
                showBackButton = false
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            verticalArrangement = Arrangement.spacedBy(0.dp)
        ) {
            // Hero Section
            item {
                HeroSection(
                    onShopNowClick = {
                        navController.navigate(Screen.Shop.route)
                    }
                )
            }
            
            // Discover Section
            item {
                DiscoverSection(
                    categories = uiState.categories,
                    onCategoryClick = { categoryId ->
                        navController.navigate("${Screen.Shop.route}?category=$categoryId")
                    }
                )
            }
            
            // Future Fashion Section
            item {
                FutureFashionSection(
                    onShopNowClick = {
                        navController.navigate(Screen.Shop.route)
                    }
                )
            }
            
            // Featured Section
            item {
                FeaturedSection(
                    featuredProducts = uiState.featuredProducts,
                    onProductClick = { productId ->
                        navController.navigate(Screen.ProductDetail.createRoute(productId))
                    }
                )
            }
            
            // Brand Text Section
            item {
                BrandTextSection()
            }
            
            // Horizontal Cards Section
            item {
                HorizontalCardsSection(
                    products = uiState.featuredProducts,
                    onProductClick = { productId ->
                        navController.navigate(Screen.ProductDetail.createRoute(productId))
                    }
                )
            }
        }
    }
}

@Composable
private fun HeroSection(
    onShopNowClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(600.dp)
    ) {
        // Background Image
        AsyncImage(
            model = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
            contentDescription = "Hero Background",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        
        // Dark Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            Color.Black.copy(alpha = 0.3f),
                            Color.Black.copy(alpha = 0.7f)
                        )
                    )
                )
        )
        
        // Content
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(32.dp)
                .padding(bottom = 80.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = "Experience premium menswear crafted with sustainable materials and minimalist design.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Color.White,
                    fontSize = 18.sp,
                    lineHeight = 28.sp
                ),
                modifier = Modifier.widthIn(max = 400.dp)
            )
            
            Button(
                onClick = onShopNowClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White.copy(alpha = 0.1f),
                    contentColor = Color.White
                ),
                modifier = Modifier.padding(top = 8.dp)
            ) {
                Text(
                    text = "EXPLORE COLLECTION",
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 1.sp
                    )
                )
            }
        }
        
        // Bottom Words
        Row(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = "Precision.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 16.sp
                )
            )
            Text(
                text = "Comfort.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 16.sp
                )
            )
            Text(
                text = "Style.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = ZeeCyan,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            )
        }
    }
}

@Composable
private fun DiscoverSection(
    categories: List<com.zeecloths.app.domain.model.Category>,
    onCategoryClick: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.8f))
            .padding(32.dp)
    ) {
        Text(
            text = "DISCOVER",
            style = MaterialTheme.typography.headlineLarge.copy(
                color = Color.White,
                fontWeight = FontWeight.SemiBold,
                fontSize = 48.sp,
                letterSpacing = 2.sp
            ),
            modifier = Modifier.padding(bottom = 40.dp)
        )
        
        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(20.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
            modifier = Modifier.height(600.dp)
        ) {
            items(categories.take(4)) { category ->
                CategoryCard(
                    category = category,
                    onClick = { onCategoryClick(category.id) }
                )
            }
        }
    }
}

@Composable
private fun CategoryCard(
    category: com.zeecloths.app.domain.model.Category,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(280.dp)
            .clickable { onClick() }
    ) {
        AsyncImage(
            model = category.imageUrl ?: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
            contentDescription = category.name,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        
        Text(
            text = category.name.uppercase(),
            style = MaterialTheme.typography.titleMedium.copy(
                color = Color.White,
                fontWeight = FontWeight.Medium,
                letterSpacing = 1.sp
            ),
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(16.dp)
        )
    }
}

@Composable
private fun FutureFashionSection(
    onShopNowClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.8f))
            .padding(32.dp),
        horizontalArrangement = Arrangement.spacedBy(60.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Image
        AsyncImage(
            model = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
            contentDescription = "Future Fashion",
            modifier = Modifier
                .weight(1f)
                .height(400.dp)
                .clip(RoundedCornerShape(0.dp)),
            contentScale = ContentScale.Crop
        )
        
        // Text Content
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Text(
                text = "FIND YOUR FUTURE FASHION",
                style = MaterialTheme.typography.headlineLarge.copy(
                    color = Color.White,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 36.sp,
                    letterSpacing = 1.sp
                )
            )
            
            Text(
                text = "Step into tomorrow's style with our cutting-edge collection. Where innovation meets elegance, we craft garments that don't just follow trends—they define them.",
                style = MaterialTheme.typography.bodyLarge.copy(
                    color = Color.White.copy(alpha = 0.8f),
                    lineHeight = 28.sp
                )
            )
            
            Button(
                onClick = onShopNowClick,
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White.copy(alpha = 0.1f),
                    contentColor = Color.White
                )
            ) {
                Text(
                    text = "SHOP NOW",
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Medium,
                        letterSpacing = 1.sp
                    )
                )
            }
        }
    }
}

@Composable
private fun FeaturedSection(
    featuredProducts: List<com.zeecloths.app.domain.model.Product>,
    onProductClick: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.8f))
            .padding(32.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(20.dp)
        ) {
            // Main Featured Card
            if (featuredProducts.isNotEmpty()) {
                FeaturedMainCard(
                    product = featuredProducts.first(),
                    onClick = { onProductClick(featuredProducts.first().id) },
                    modifier = Modifier.weight(1f)
                )
            }
            
            // Side Cards Grid
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier
                    .weight(1f)
                    .height(320.dp)
            ) {
                items(featuredProducts.take(4)) { product ->
                    FeaturedSideCard(
                        product = product,
                        onClick = { onProductClick(product.id) }
                    )
                }
            }
        }
    }
}

@Composable
private fun FeaturedMainCard(
    product: com.zeecloths.app.domain.model.Product,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(320.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.1f)
        )
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = product.imageUrl ?: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
                contentDescription = product.name,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            // Overlay
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.4f))
            )
            
            Column(
                modifier = Modifier
                    .align(Alignment.Center)
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "FIND YOUR STYLE",
                    style = MaterialTheme.typography.headlineSmall.copy(
                        color = Color.White,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 1.sp
                    ),
                    textAlign = TextAlign.Center
                )
                
                Text(
                    text = "Discover your unique fashion identity with our curated collection",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = Color.White.copy(alpha = 0.8f),
                        textAlign = TextAlign.Center
                    ),
                    modifier = Modifier.padding(top = 8.dp)
                )
            }
        }
    }
}

@Composable
private fun FeaturedSideCard(
    product: com.zeecloths.app.domain.model.Product,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .height(150.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.1f)
        )
    ) {
        Box(modifier = Modifier.fillMaxSize()) {
            AsyncImage(
                model = product.imageUrl ?: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
                contentDescription = product.name,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            Text(
                text = product.categoryName?.uppercase() ?: "FASHION",
                style = MaterialTheme.typography.labelMedium.copy(
                    color = Color.White,
                    fontWeight = FontWeight.Medium
                ),
                modifier = Modifier
                    .align(Alignment.BottomStart)
                    .padding(12.dp)
            )
        }
    }
}

@Composable
private fun BrandTextSection() {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.9f))
            .padding(vertical = 80.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "ZEECLOTHS",
            style = MaterialTheme.typography.displayLarge.copy(
                color = Color.White,
                fontWeight = FontWeight.Bold,
                fontSize = 72.sp,
                letterSpacing = 8.sp
            ),
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun HorizontalCardsSection(
    products: List<com.zeecloths.app.domain.model.Product>,
    onProductClick: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.Black.copy(alpha = 0.8f))
            .padding(vertical = 40.dp)
    ) {
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(20.dp),
            contentPadding = PaddingValues(horizontal = 32.dp)
        ) {
            items(products) { product ->
                HorizontalProductCard(
                    product = product,
                    onClick = { onProductClick(product.id) }
                )
            }
        }
    }
}

@Composable
private fun HorizontalProductCard(
    product: com.zeecloths.app.domain.model.Product,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(250.dp)
            .height(350.dp)
            .clickable { onClick() },
        colors = CardDefaults.cardColors(
            containerColor = Color.White.copy(alpha = 0.1f)
        )
    ) {
        Column {
            AsyncImage(
                model = product.imageUrl ?: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
                contentDescription = product.name,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(280.dp),
                contentScale = ContentScale.Crop
            )
            
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = product.name,
                    style = MaterialTheme.typography.titleMedium.copy(
                        color = Color.White,
                        fontWeight = FontWeight.Medium
                    )
                )
                
                Text(
                    text = "₹${product.price.toInt()}",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = ZeeCyan,
                        fontWeight = FontWeight.SemiBold
                    ),
                    modifier = Modifier.padding(top = 4.dp)
                )
            }
        }
    }
}