# Page, Feature, UI

patern pra organização
separando em Page,Feature e UI
pra deixar a estrutura mais bem separada e definida, facilitando entendimento e manutenção

# page

representação de uma página única na interface do usuário, como uma página de login, uma página de perfil de usuário ou uma página de produtos.
Geralmente, uma Page corresponde a uma rota específica em uma aplicação web ou móvel.
Pode conter vários componentes de UI e Features

```tsx
export default function SignPage() {
	useEffect(() => {
		// fetch
	});

	return (
		<div style={{ display: "flex", alignItems: "center", justfyContent: "center" }} >
			<SignInForm />
			<SignInSocialMedia /> {// extra example}
		</div>
	)
}
```

# feature
unidade de funcionalidade ou comportamento específico em uma aplicação, que pode ser reutilizada em várias partes da aplicação

```tsx
export default function SignInForm() {
	const validation  = {
		// validation
	}
	const handleSubmit = () => {
		// handle subimit
	}
	
	return (
		<Card>
			<TextInput label="email" />
			<TextInput label="password" />
			<Button title="Sign In" />	
		</Card>
	);
}
```

# UI
puro UI component, div, estilo, recebe props, exibe na tela

```tsx
export default function Card({ children }) {
	return (
		<div className="bla" onClick={() => onClick()}>
			{children}
		</div>
	)
}
```
