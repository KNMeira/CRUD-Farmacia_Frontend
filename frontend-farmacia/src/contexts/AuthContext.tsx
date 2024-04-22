import { createContext, ReactNode, useState } from "react";
import UsuarioLogin from "../models/UsuarioLogin";
import Categoria from "../models/Categoria"; // Importe o modelo de Categoria
import Produto from "../models/Produto"; // Importe o modelo de Produto
import { login } from "../services/Service";

interface AuthContextProps {
    usuario: UsuarioLogin;
    categorias: Categoria[]; // Adicione a lista de categorias ao contexto
    produtos: Produto[]; // Adicione a lista de produtos ao contexto
    handleLogout(): void;
    handleLogin(usuario: UsuarioLogin): Promise<void>;
    isLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: "",
        usuario: "",
        senha: "",
        foto: "",
        token: ""
    });

    const [categorias, setCategorias] = useState<Categoria[]>([]); 
    const [produtos, setProdutos] = useState<Produto[]>([]); 

    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(userLogin: UsuarioLogin) {
        setIsLoading(true);
        try {
            await login(`/usuarios/logar`, userLogin, setUsuario);
            alert("Usuário logado com sucesso");
            setIsLoading(false);
           
        } catch (error) {
            console.log(error);
            alert("Dados do usuário inconsistentes");
            setIsLoading(false);
        }
    }

    function handleLogout() {
        setUsuario({
            id: 0,
            nome: "",
            usuario: "",
            senha: "",
            foto: "",
            token: ""
        });
        setCategorias([]); 
        setProdutos([]); 
    }

    return (
        <AuthContext.Provider value={{ usuario, categorias, produtos, handleLogin, handleLogout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
