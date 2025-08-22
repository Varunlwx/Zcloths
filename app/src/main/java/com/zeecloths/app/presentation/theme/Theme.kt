package com.zeecloths.app.presentation.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = ZeeCyan,
    secondary = ZeeCyanLight,
    tertiary = Pink80,
    background = ZeeBlack,
    surface = ZeeSurfaceDark,
    onPrimary = ZeeWhite,
    onSecondary = ZeeBlack,
    onTertiary = ZeeBlack,
    onBackground = ZeeWhite,
    onSurface = ZeeWhite
)

private val LightColorScheme = lightColorScheme(
    primary = ZeeBlack,
    secondary = ZeeCyan,
    tertiary = Pink40,
    background = ZeeWhite,
    surface = ZeeSurface,
    onPrimary = ZeeWhite,
    onSecondary = ZeeWhite,
    onTertiary = ZeeWhite,
    onBackground = ZeeBlack,
    onSurface = ZeeBlack
)

@Composable
fun ZeeClothsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}