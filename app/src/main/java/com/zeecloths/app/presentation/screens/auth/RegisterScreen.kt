package com.zeecloths.app.presentation.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import com.zeecloths.app.presentation.navigation.Screen
import com.zeecloths.app.presentation.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    navController: NavController,
    viewModel: AuthViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    var firstName by remember { mutableStateOf("") }
    var lastName by remember { mutableStateOf("") }
    var username by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var address by remember { mutableStateOf("") }
    
    LaunchedEffect(uiState.isAuthenticated) {
        if (uiState.isAuthenticated) {
            navController.navigate(Screen.Home.route) {
                popUpTo(Screen.Register.route) { inclusive = true }
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
            // Left side - Register Form
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxHeight()
                    .padding(32.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                RegisterCard(
                    firstName = firstName,
                    lastName = lastName,
                    username = username,
                    email = email,
                    phone = phone,
                    password = password,
                    confirmPassword = confirmPassword,
                    address = address,
                    onFirstNameChange = { firstName = it },
                    onLastNameChange = { lastName = it },
                    onUsernameChange = { username = it },
                    onEmailChange = { email = it },
                    onPhoneChange = { phone = it },
                    onPasswordChange = { password = it },
                    onConfirmPasswordChange = { confirmPassword = it },
                    onAddressChange = { address = it },
                    onRegisterClick = {
                        if (password == confirmPassword) {
                            viewModel.register(
                                username = username,
                                email = email,
                                password = password,
                                firstName = firstName,
                                lastName = lastName,
                                phone = phone,
                                address = address
                            )
                        }
                    },
                    onLoginClick = {
                        navController.navigate(Screen.Login.route)
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
                AnimatedBackground()
            }
        }
    }
}

@Composable
private fun RegisterCard(
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    phone: String,
    password: String,
    confirmPassword: String,
    address: String,
    onFirstNameChange: (String) -> Unit,
    onLastNameChange: (String) -> Unit,
    onUsernameChange: (String) -> Unit,
    onEmailChange: (String) -> Unit,
    onPhoneChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onConfirmPasswordChange: (String) -> Unit,
    onAddressChange: (String) -> Unit,
    onRegisterClick: () -> Unit,
    onLoginClick: () -> Unit,
    isLoading: Boolean,
    error: String?
) {
    Card(
        modifier = Modifier
            .widthIn(max = 500.dp)
            .fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = Color.Black.copy(alpha = 0.8f)
        ),
        shape = RoundedCornerShape(20.dp)
    ) {
        Column(
            modifier = Modifier.padding(40.dp),
            verticalArrangement = Arrangement.spacedBy(20.dp),
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
                    text = "Create your account to start shopping",
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
                // Name Row
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedTextField(
                        value = firstName,
                        onValueChange = onFirstNameChange,
                        label = { Text("First Name", color = Color.White.copy(alpha = 0.7f)) },
                        modifier = Modifier.weight(1f),
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
                        value = lastName,
                        onValueChange = onLastNameChange,
                        label = { Text("Last Name", color = Color.White.copy(alpha = 0.7f)) },
                        modifier = Modifier.weight(1f),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White,
                            focusedBorderColor = ZeeCyan,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                            cursorColor = ZeeCyan
                        ),
                        singleLine = true
                    )
                }
                
                OutlinedTextField(
                    value = username,
                    onValueChange = onUsernameChange,
                    label = { Text("Username", color = Color.White.copy(alpha = 0.7f)) },
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
                    value = email,
                    onValueChange = onEmailChange,
                    label = { Text("Email", color = Color.White.copy(alpha = 0.7f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ZeeCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = phone,
                    onValueChange = onPhoneChange,
                    label = { Text("Phone", color = Color.White.copy(alpha = 0.7f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ZeeCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                    singleLine = true
                )
                
                OutlinedTextField(
                    value = password,
                    onValueChange = onPasswordChange,
                    label = { Text("Password", color = Color.White.copy(alpha = 0.7f)) },
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
                
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = onConfirmPasswordChange,
                    label = { Text("Confirm Password", color = Color.White.copy(alpha = 0.7f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = if (password == confirmPassword || confirmPassword.isEmpty()) ZeeCyan else ZeeRed,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    singleLine = true,
                    isError = password != confirmPassword && confirmPassword.isNotEmpty()
                )
                
                OutlinedTextField(
                    value = address,
                    onValueChange = onAddressChange,
                    label = { Text("Address", color = Color.White.copy(alpha = 0.7f)) },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = ZeeCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                        cursorColor = ZeeCyan
                    ),
                    maxLines = 3
                )
            }
            
            // Register Button
            Button(
                onClick = onRegisterClick,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color.White.copy(alpha = 0.1f),
                    contentColor = Color.White
                ),
                enabled = !isLoading && password == confirmPassword && password.isNotEmpty()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        color = Color.White,
                        strokeWidth = 2.dp
                    )
                } else {
                    Text(
                        text = "CREATE ACCOUNT",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Medium,
                            letterSpacing = 1.sp
                        )
                    )
                }
            }
            
            // Login Link
            Text(
                text = "Already have an account? Login here",
                style = MaterialTheme.typography.bodyMedium.copy(
                    color = ZeeCyan
                ),
                modifier = Modifier.clickable { onLoginClick() }
            )
        }
    }
}

@Composable
private fun AnimatedBackground() {
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