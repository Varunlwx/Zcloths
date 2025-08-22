package com.zeecloths.app.presentation.screens.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.zeecloths.app.R
import com.zeecloths.app.presentation.navigation.Screen
import com.zeecloths.app.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    navController: NavController,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    
    LaunchedEffect(uiState.isAuthenticated) {
        if (uiState.isAuthenticated) {
            navController.navigate(Screen.Home.route) {
                popUpTo(Screen.Login.route) { inclusive = true }
            }
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // Background with 3D effect simulation
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.radialGradient(
                        colors = listOf(
                            Color(0xFF1a1a2e),
                            Color(0xFF16213e),
                            Color.Black
                        )
                    )
                )
        )
        
        Row(
            modifier = Modifier.fillMaxSize()
        ) {
            // Left side - Login Form
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .padding(32.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                LoginCard(
                    username = username,
                    password = password,
                    onUsernameChange = { username = it },
                    onPasswordChange = { password = it },
                    onLoginClick = {
                        viewModel.login(username, password)
                    },
                    onRegisterClick = {
                        navController.navigate(Screen.Register.route)
                    },
                    isLoading = uiState.isLoading,
                    error = uiState.error
                )
            }
            
            // Right side - 3D Background simulation
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xFF0f3460),
                                Color(0xFF533483),
                                Color(0xFF16537e)
                            )
                        )
                    )
            ) {
                // Animated geometric shapes to simulate 3D
                AnimatedBackground()
            }
        }
    }
}

@Composable
private fun LoginCard(
    username: String,
    password: String,
    onUsernameChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onLoginClick: () -> Unit,
    onRegisterClick: () -> Unit,
    isLoading: Boolean,
    error: String?
) {
    Card(
        modifier = Modifier
            .widthIn(max = 400.dp)
            .fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.Black.copy(alpha = 0.8f)
        ),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(
            modifier = Modifier.padding(40.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Header
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "ZEECLOTHS",
                    style = MaterialTheme.typography.headlineLarge.copy(
                        color = Color.White,
                        fontWeight = FontWeight.Normal,
                        fontSize = 32.sp,
                        letterSpacing = 2.sp
                    )
                )
                
                Text(
                    text = "Welcome back. Please login to continue.",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = Color.White.copy(alpha = 0.8f),
                        textAlign = TextAlign.Center
                    )
                )
            }
            
            // Error Message
            if (error != null) {
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = ZeeRed.copy(alpha = 0.1f)
                    )
                ) {
                    Text(
                        text = error,
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = ZeeRed
                        ),
                        modifier = Modifier.padding(12.dp)
                    )
                }
            }
            
            // Form Fields
            Column(
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                OutlinedTextField(
                    value = username,
                    onValueChange = onUsernameChange,
                    label = { Text("Username", color = Color.White.copy(alpha = 0.7f)) },
                    placeholder = { Text("Enter your username", color = Color.White.copy(alpha = 0.5f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ZeeCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = password,
                    onValueChange = onPasswordChange,
                    label = { Text("Password", color = Color.White.copy(alpha = 0.7f)) },
                    placeholder = { Text("Enter your password", color = Color.White.copy(alpha = 0.5f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ZeeCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    singleLine = true
                )
            }
            
            // Login Button
            Button(
                onClick = onLoginClick,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White.copy(alpha = 0.1f),
                    contentColor = Color.White
                ),
                enabled = !isLoading
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "LOGIN",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Medium,
                            letterSpacing = 1.sp
                        )
                    )
                }
            }
            
            // Demo Info
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = Color.White.copy(alpha = 0.05f)
                )
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "Demo Credentials:",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = Color.White,
                            fontWeight = FontWeight.SemiBold
                        )
                    )
                    
                    Text(
                        text = "Admin: admin / admin123\nUser: user / user123",
                        style = MaterialTheme.typography.bodySmall.copy(
                            color = Color.White.copy(alpha = 0.8f),
                            textAlign = TextAlign.Center
                        ),
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }
            }
            
            // Register Link
            Text(
                text = "Don't have an account? Register here",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = ZeeCyan
                ),
                modifier = Modifier.clickable { onRegisterClick() }
            )
        }
    }
}

@Composable
private fun AnimatedBackground() {
    // Simulate 3D background with animated shapes
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(
                        Color(0xFF1a1a2e).copy(alpha = 0.8f),
                        Color(0xFF16213e).copy(alpha = 0.6f),
                        Color.Black.copy(alpha = 0.9f)
                    )
                )
            )
    )
}