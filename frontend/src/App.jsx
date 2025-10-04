import { ConfigProvider, App as AntApp } from 'antd'
import globalThemeConfig from './configs/global-theme.config'
import { StyleProvider } from '@ant-design/cssinjs';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Routes from './routes/Routes';


function App() {
	const router = createBrowserRouter(Routes);

	return (
		<StyleProvider layer>
			<ConfigProvider theme={globalThemeConfig}>
				<AntApp>
					<RouterProvider router={router} />
				</AntApp>
			</ConfigProvider>
		</StyleProvider>
	)
}

export default App
