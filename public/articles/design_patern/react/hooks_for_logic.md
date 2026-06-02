# "Hooks for Logic" ou "Hooks for Stateful Logic"

abstrair coisas pra hooks, mesmo que elas não sejam necessariamente reutilizaveis


Esses hooks são frequentemente utilizados para manter os componentes mais limpos e modulares, promovendo a reutilização e a separação de preocupações.

isso fica melhor ainda se tiver varias lógicas dentro de um componente


## exemplo 1

### antes:

SignInPage.tsx
```tsx
import { useEffect } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
	useEffect(() => {
		// fetch data
	}, []);
	
	useEffect(() => {
		// send analytics events
	}, []);
	
	// other effects go here...
	
	return (
		<div>
			<SignInForm />

		</div>
	);
}
```

### depoisSignInPage.hooks
```tsx
import { useEffect } from "react";

export const useSignInPage = () => {
	useEffect(() => {
		// fetch data
	}, []);
	
	useEffect(() => {
		// send analytics events
	}, []);
	
	// other effects go here...
};
```

SignInPage.tsx
```tsx
import { useSignInPage } from "./useSignInPage";
import SignInForm from "./SignInForm";

export default function SignInPage() {
	useSignInPage();
	
	return (
		<div>
			<SignInForm />
		</div>
	);
}
```

mesma funcionalidade, mas todos os hooks, toda a logica extraida para o custom hook
agora signInPage é resposável só pra renderizar a pagina, imagina com varios useEffects

## exemplo 2 chat gpt

exemplo antes:
```tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.example.com/data');
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Data: {data}</div>;
};

export default MyComponent;
```

depois
```tsx
import React from 'react';
import useApiData from './useApiData';

const MyComponent = () => {
  const { data, loading, error } = useApiData('https://api.example.com/data');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>Data: {data}</div>;
};

export default MyComponent;
```

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useApiData = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useApiData;
```



