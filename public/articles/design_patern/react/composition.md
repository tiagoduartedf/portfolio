# patern de composição


# qnd usar?
qnd vc quer criar um componente com subcomponentes especificos

E PRINCIPALMENTE EM:
componentes de multiplas customizações
evitando um componente com um monte de props condicionais

exemplo:
um input que pode ter botao na direita fora, icone dentro na esquerda, icone dentro na direita...

acaba tendo que ter uma props 
controladora como `outsideButtonsType`, é melhor fazer no patern de composição pq/pra



podendo manter uma semantica melhor no uso e personalizar individualmente cada subcomponente




basicamente repatir um componente maior em varios pedaçinhos e dps usar dotnotation pra chamar subcomponentes
(radix UI usa isso)

...

# como usar?

## trocaria:

// uso
```tsx
<div className="example">
	<InputButton
		// aqui condicional pra renderizar os botões internos e externos
		outsideButtonsType = "double" || "only-left" || "only-right" || "no-button"
		// 
		outsideLeftButton="minus-circle"
		outsideLeftAction={() => alert("remover")}
		outsideRightButton="plus-circle"
		outsideRightAction={() => alert("adicionar")}
	/>
</div>
```

// inputbutton.tsx
```tsx
export default function InputButton({ text }: { text: string }) {
	return (
		<div>
			{ (outsideButtonsType == "double" || outsideButtonsType == "only-left") && (<Icon name={outsideLeftButton} onPress={() => outsideLeftAction()} /> }
			<input placeholder={text} />
			{ (outsideButtonsType == "double" || outsideButtonsType == "only-right") && (<Icon name={outsideRightButton} onPress={() => outsideRightButton()} /> }
		</div>
	)
}
```

## por:
// index.tsx
```tsx
import InputbuttonRoot from "./InputbuttonRoot";
import InputButtonOutsideButtons from "./InputButtonOutsideButtons";

export const InputButton = {
	Root: InputbuttonRoot,
	Input: InputbuttonInput,
	IconClickable: InputbuttonIconClickable,
}
```

// InputbuttonRoot (container)
```tsx
export default function InputbuttonRoot({ children }: { children: React.ReactNode }) {
	return (
		<div className="example">
			{children}
		</div>
	)
}
```

// InputbuttonInput.tsx
```tsx
export default function InputbuttonInput({ text }: { text: string }) {
	return (
		<input placeholder={text} />
	)
}
```

// InputbuttonIconClickable.tsx
```tsx
export default function InputbuttonIconClickable({ name, onPress }: { name: string; onPress: Function } ) {
	return (
		<Icon name={name} onPress={() => onPress()} /> 
	)
}
```

// uso
eae agora na hora de usar:
```tsx
<InputButton.Root>
	<InputButton.IconClickable name="minus-circle" onPress={() => alert("remover")} />
	<InputButton.Input text="Digite aqui" />
</InputButton.Root>
```









# outro exemplo implementado com bloqueio de children (filho) & container (pai)

```tsx
<SelectOption.Container>
	<SelectOption.Item value="dono">Proprietário</SelectOption.Item>
	<SelectOption.Item value="presidente">
		Presidente ou C-Level
	</SelectOption.Item>
	<SelectOption.Item value="diretor">Diretor</SelectOption.Item>
	<SelectOption.Item value="gerente">Gerente</SelectOption.Item>
	<SelectOption.Item value="coordenador">Coordenador</SelectOption.Item>
	<SelectOption.Item value="analista">Analista</SelectOption.Item>
	<SelectOption.Item value="estagiario">Estagiário</SelectOption.Item>
	<SelectOption.Item value="outro">Outro</SelectOption.Item>
</SelectOption.Container>
```

```tsx
import React from "react";
import Select from "./Select";
import Option from "./Option";

const SelectOption = {
  Container: Select, // Root
  Item: Option,
};
export default SelectOption;

// block option pra ser usado so dentro de select
interface SelectContextType {
  isInsideSelect: boolean;
}
export const SelectContext = React.createContext<SelectContextType>({
  isInsideSelect: false,
});
```

```tsx
import React from "react";
import Option from "./Option";
import { SelectContext } from "./SelectOption";

export default function Select({ children }: { children: React.ReactNode }) {
  ValidateBlockedChildren(children);
  return (
    <SelectContext.Provider value={{ isInsideSelect: true }}>
      <select>{children}</select>
    </SelectContext.Provider>
  );
}

function ValidateBlockedChildren(children: React.ReactNode) {
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child) || child.type !== Option) {
      throw new Error("Select component only accepts Option as children");
    }
  });
}
```

```tsx
import React, { useContext } from "react";
import { SelectContext } from "./SelectOption";

export default function Option({
  value,
  children,
}: {
  value: string;
  children: string;
}) {
  const { isInsideSelect } = useContext(SelectContext);
  ValidateBlockedContainer(isInsideSelect);
  return <option value={value}>{children}</option>;
}

function ValidateBlockedContainer(isInsideSelect: boolean) {
  if (!isInsideSelect) {
    throw new Error("Option component only accepts Select as container");
  }
}
```