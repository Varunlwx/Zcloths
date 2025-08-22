package com.zeecloths.app.presentation.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.zeecloths.app.domain.model.Category
import com.zeecloths.app.domain.model.Product
import com.zeecloths.app.domain.repository.CategoryRepository
import com.zeecloths.app.domain.repository.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val categoryRepository: CategoryRepository,
    private val productRepository: ProductRepository
) : ViewModel() {
    
    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()
    
    init {
        loadHomeData()
    }
    
    private fun loadHomeData() {
        viewModelScope.launch {
            combine(
                categoryRepository.getAllCategories(),
                productRepository.getFeaturedProducts(8)
            ) { categories, products ->
                _uiState.value = _uiState.value.copy(
                    categories = categories,
                    featuredProducts = products,
                    isLoading = false
                )
            }
        }
    }
}

data class HomeUiState(
    val categories: List<Category> = emptyList(),
    val featuredProducts: List<Product> = emptyList(),
    val isLoading: Boolean = true,
    val error: String? = null
)