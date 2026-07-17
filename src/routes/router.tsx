import { createBrowserRouter } from 'react-router-dom';
import { App, AuthPage, HomePage, MyWishlistPage, ProfilePage, WishEditor, WishPage } from '../App';
import { NotFoundPage } from './NotFoundPage';
export const router = createBrowserRouter([{ path:'/', element:<App />, errorElement:<NotFoundPage />, children:[{index:true,element:<HomePage />},{path:'auth',element:<AuthPage />},{path:'mine',element:<MyWishlistPage />},{path:'profile',element:<ProfilePage />},{path:'wish/new',element:<WishEditor />},{path:'wish/:slug/edit',element:<WishEditor />},{path:'w/:slug',element:<WishPage />},{path:'*',element:<NotFoundPage />}]}]);
