# Child component rerendering

Component where there is a reexecuted is where the component there is the state update

If a parent component is reexecuted, all its child component will be reexecuted as well.

It can be bad for performance optimization

# ReactMemo

To avoid that we can use React.memo : it will only rerender the component if its props changed


```javascript
import React from 'react'
import MyParagraph from './MyParagraph'
 
const DemoOutput = (props) => {
    console.log('demo output running')
return <MyParagraph>{props.show ? 'this is new' : ''}</MyParagraph>
}
 
export default React.memo(DemoOutput)
```


Mais on le fait pas partout ce react,memo parce que ca a un cost aussi, le cost de props comparison au lieu du cost de rerender

Donc ca a un interet si veux eviter toute une branche de components de rerender. 

Si c’est un component qui doit etre rerender souvent, qui change souvent ca vaut pas le coup, si ce n’est pas le cas, il vaut mieux utiliser react.memo


```javascript
import React, {useState} from 'react';
import Button from './components/UI/Button/Button'
import './App.css';
import DemoOutput from './components/Demo/DemoOutput';
 
function App() {
  const [showParagraph, setShowParagraph] =useState(false);
 
console.log('App running')
 
const toggleParagraphHandler = () => {
  setShowParagraph(prevShowParagraph => !prevShowParagraph)
}
 
  return (
    <div className="app">
      <h1>Hi there!</h1>
    <DemoOutput show={false}/>
      <Button onClick={toggleParagraphHandler}>Toggle paragraph</Button>
    </div>
  );
}
 
export default App;
```

Sauf que ca marche pour les boolean comme pour le component demoOutput mais ca marche pas pour les fonctions ou arrays. 

Parce que quand tu rerender App, une nouvelle fonction toggleParagraphHandler est recree, same for show={false}.

Mais la comparison est ok pour les boolean, pas pour les fonctions ou arrays, javascript va considerer que c’est different


# useCallback()

On peut resoudre ca grace au hook useCallback.

Ca va sauver ma fonction et dire a react de ne pas la recreer a chaque execution


```javascript
import React, {useState, useCallback} from 'react';
import Button from './components/UI/Button/Button'
import './App.css';
import DemoOutput from './components/Demo/DemoOutput';
 
function App() {
  const [showParagraph, setShowParagraph] =useState(false);
 
console.log('App running')
 
const toggleParagraphHandler = useCallback(() => {
  setShowParagraph(prevShowParagraph => !prevShowParagraph)
}, [])
 
  return (
    <div className="app">
      <h1>Hi there!</h1>
    <DemoOutput show={false}/>
      <Button onClick={toggleParagraphHandler}>Toggle paragraph</Button>
    </div>
  );
}
 
export default App;
```

Des fois on a quand meme besoin que la fonction soit reupdated si une valeur change , donc on va rajouter cette valeur en dependency dans le useCallback


```javascript
import React, {useState, useCallback} from 'react';
import Button from './components/UI/Button/Button'
import './App.css';
import DemoOutput from './components/Demo/DemoOutput';
 
function App() {
  const [showParagraph, setShowParagraph] =useState(false);
  const [allowToggle, setAllowToggle] =useState(false);
 
console.log('App running')
 
const toggleParagraphHandler = useCallback(() => {
  if (allowToggle){
  setShowParagraph(prevShowParagraph => !prevShowParagraph)
}
}, [allowToggle])
 
const allowToggleHandler = () => {
  setAllowToggle(true)
}
 
  return (
    <div className="app">
      <h1>Hi there!</h1>
    <DemoOutput show={showParagraph}/>
      <Button onClick={allowToggleHandler}>allow toggle</Button>
      <Button onClick={toggleParagraphHandler}>Toggle paragraph</Button>
   
    </div>
  );
}
 
export default App;
```

# State

Le state en revanche n’est pas réinitialiser a chaque component rerender

UseMemo allows to memorize any type of data you want to store

Store sorting result


```javascript
import React, { useMemo } from 'react';

import classes from './DemoList.module.css';

const DemoList = (props) => {
  const { items } = props;

  const sortedList = useMemo(() => {
    console.log('Items sorted');
    return items.sort((a, b) => a - b);
  }, [items]); 
  console.log('DemoList RUNNING');

  return (
    <div className={classes.list}>
      <h2>{props.title}</h2>
      <ul>
        {sortedList.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(DemoList);
```

Store array


```javascript
import React, { useState, useCallback, useMemo } from 'react';

import './App.css';
import DemoList from './components/Demo/DemoList';
import Button from './components/UI/Button/Button';

function App() {
  const [listTitle, setListTitle] = useState('My List');

  const changeTitleHandler = useCallback(() => {
    setListTitle('New Title');
  }, []);

  const listItems = useMemo(() => [5, 3, 1, 10, 9], []);

  return (
    <div className="app">
      <DemoList title={listTitle} items={listItems} />
      <Button onClick={changeTitleHandler}>Change List Title</Button>
    </div>
  );
}

export default App;
```