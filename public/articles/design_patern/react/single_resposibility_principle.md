# sigle responsability principle
princípio de "Single Responsibility Principle" (SRP) 
o famoso S do solid

no contexto do React pode ser considerado um padrão de design
qnd aplicado a organização e estruturação de componentes react


## vantagens

facilitar a manutenção, reutilização e entendimento do cóigo

## qnd usar?
sempre


cada componente é responsavel por uma coisa e delegar todo o resto para outro componente

```tsx
export default function InstagramHomePage() {
	return (
		<>
			<Header />
			<Status />
			<ScrollViewPosts />
			<FooterIcons />
		</>
	)
}

export default function ScrollViewPosts() {
	const [posts, setPosts] = useState([]);
	
	useEffect(() => {
		// fetch data
	}, []);
	
	return (
		<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
			posts.map((e) => {
				return <PostCard post={e}>
			})
		</div>
	)
}
```

