// Import npm packages.
import React, { Component } from 'react'

// Import react components.
import NutritionCalculator from './components/nutrition_calculator'

// Import react context components.
import { AccountProvider } from './components/account/account_provider'
import { AccountRecordsProvider } from './components/account/account_records'

class App extends Component
{
	render(){
		return (
			<AccountProvider>
				<AccountRecordsProvider>
					<NutritionCalculator />
				</ AccountRecordsProvider>
			</AccountProvider>
		)
	}
}

export default App
