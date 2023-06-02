import './App.css';
import { useState } from 'react';

function Header(props) {
  return (
    <header>
      <h1>
        <a
          href="/"
          onClick={event => {
            event.preventDefault();
            props.onChangeMode();
          }}
        >
          {props.title}
        </a>
      </h1>
    </header>
  );
}

function Nav(props) {
  const list = [];
  const topics = props.topics;
  for (var i in topics) {
    list.push(
      <li key={topics[i].id}>
        <a
          id={topics[i].id}
          href={'/read/' + topics[i].id}
          onClick={event => {
            event.preventDefault();
            props.onChangeMode(Number(event.target.id));
          }}
        >
          {topics[i].title}
        </a>
      </li>
    );
  }
  return (
    <nav>
      <ol>{list}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return (
    <article>
      <h2>Create</h2>
      <form
        onSubmit={event => {
          event.preventDefault();
          // form 태그(event.target)에서 name이 title인 태그
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onCreate(title, body);
        }}
      >
        <p>
          <input type="text" name="title" placeholder="title"></input>
        </p>
        <p>
          <textarea name="body" placeholder="body"></textarea>
        </p>
        <p>
          <input type="submit" value="Create"></input>
        </p>
      </form>
    </article>
  );
}

function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return (
    <article>
      <h2>Update</h2>
      <form
        onSubmit={event => {
          event.preventDefault();
          const title = event.target.title.value;
          const body = event.target.body.value;
          props.onUpdate(title, body);
        }}
      >
        <p>
          <input
            type="text"
            name="title"
            placeholder="title"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
            }}
          ></input>
        </p>
        <p>
          <textarea
            name="body"
            placeholder="body"
            value={body}
            onChange={event => {
              setBody(event.target.value);
            }}
          ></textarea>
        </p>
        <p>
          <input type="submit" value="Update"></input>
        </p>
      </form>
    </article>
  );
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [topics, setTopics] = useState([
    { id: 1, title: 'html', body: 'html is ...' },
    { id: 2, title: 'css', body: 'css is ...' },
    { id: 3, title: 'js', body: 'js is ...' },
  ]);
  let content = null;
  let contextControl = null; // 맥락적으로 노출되는 UI

  switch (mode) {
    case 'WELCOME':
      content = <Article title="Welcome" body="Hello, WEB"></Article>;
      break;
    case 'READ':
      var topic = null;
      for (var i in topics) {
        if (topics[i].id === id) topic = topics[i];
      }
      content = <Article title={topic.title} body={topic.body}></Article>;
      contextControl = (
        <>
          <li>
            <a
              href={'/update/' + id}
              onClick={event => {
                event.preventDefault();
                setMode('UPDATE');
              }}
            >
              Update
            </a>
          </li>
          <li>
            <input
              type="button"
              value="Delete"
              onClick={() => {
                const newTopics = [];
                for (var i in topics) {
                  if (topics[i].id !== id) {
                    newTopics.push(topics[i]);
                  }
                }
                setTopics(newTopics);
                setMode('WELCOME');
              }}
            ></input>
          </li>
        </>
      );
      break;
    case 'CREATE':
      content = (
        <Create
          onCreate={(_title, _body) => {
            const newTopic = {
              id: topics.length + 1,
              title: _title,
              body: _body,
            };
            const newTopics = [...topics];
            newTopics.push(newTopic);
            setTopics(newTopics);
            setMode('READ');
            setId(newTopic.id);
          }}
        ></Create>
      );
      break;
    case 'UPDATE':
      var topic = null;
      for (var i in topics) {
        if (topics[i].id === id) topic = topics[i];
      }
      content = (
        <Update
          title={topic.title}
          body={topic.body}
          onUpdate={(_title, _body) => {
            const newTopics = [...topics];
            const updatedTopic = { id: id, title: _title, body: _body };
            for (var i in newTopics) {
              if (newTopics[i].id === id) {
                newTopics[i] = updatedTopic;
              }
            }
            setTopics(newTopics);
            setMode('READ');
          }}
        ></Update>
      );
      break;
  }

  return (
    <div>
      <Header
        title="WEB"
        onChangeMode={() => {
          setMode('WELCOME');
        }}
      ></Header>
      <Nav
        topics={topics}
        onChangeMode={_id => {
          setMode('READ');
          setId(_id);
        }}
      ></Nav>
      {content}
      <ul>
        <li>
          <a
            href="/create"
            onClick={event => {
              event.preventDefault();
              setMode('CREATE');
            }}
          >
            Create
          </a>
        </li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
