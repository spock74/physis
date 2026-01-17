# Physis / digital-garden

> [!NOTE]
> **Status do Projeto: Experimental (Alpha)**
> Este projeto encontra-se em estágio inicial de desenvolvimento, concebido primariamente para uso pessoal como um laboratório de experimentação, um "jardim digital". Embora a arquitetura tente seguir padrões profissionais visando escalabilidade as funcionalidades e estruturas estão sujeitas a alterações frequentes.

Trata-se de uma plataforma de publicação na web (blog pessoal, a princípio para meu uso pessoal, mas espero que seja adaptável sem grandes dificuldades para alguém com demandas similares) construída sobre uma arquitetura de "Explorable Explanations". O sistema permite a integração de narrativas textuais com simulações matemáticas e físicas interativas.

O gerenciamento de conteúdo opera através de um sistema baseado em arquivos (File-Based CMS) utilizando MDX, permitindo a renderização híbrida de Markdown e Componentes React.

Exemplo _hello world!_ deployed from Vercel: [Physis](https://physis-sable.vercel.app/pt)

## Stack Tecnológica

* **Framework:** Next.js
* **Linguagem:** TypeScript
* **Estilização:** Tailwind CSS
* **Conteúdo:** MDX (Markdown + JSX)
* **Internacionalização:** Roteamento nativo do Next.js (en/pt)
* **Simulações:** React (Custom Hooks para lógica matemática)
* **Gerenciador de Pacotes:** pnpm

## Instalação e Execução

Para configurar o ambiente de desenvolvimento local:

1.  Instale as dependências:
    ```bash
    pnpm install
    ```

2.  Inicie o servidor de desenvolvimento:
    ```bash
    pnpm dev
    ```

3.  A aplicação estará disponível em `http://localhost:3000`.

---

## Guia de Criação de Conteúdo

O conteúdo do sistema reside no diretório `content/essays`. A estrutura de pastas separa os idiomas (`en` para inglês, `pt` para português). O sistema observa essas pastas e compila automaticamente os arquivos `.mdx` em páginas acessíveis via navegador.

### 1. Estrutura Básica de um post ou Artigo: `MDX`

Pode-se definir o MDX através de três pilares técnicos:

 **1. O MDX é um superset do Markdown.**
Isso significa que ele respeita a especificação original do Markdown (CommonMark), mas estende sua gramática para aceitar e interpretar sintaxe JSX (JavaScript XML) dentro do mesmo arquivo.

 **2. É Código, não Texto Estático**

Diferente de um arquivo `.md` tradicional que é analisado (*parsed*) e convertido para HTML estático, o MDX é **transpilado** para JavaScript.
Quando o seu sistema de build (Next.js) processa um arquivo `.mdx`, ele o transforma em um **Componente React funcional**.

- **Entrada:** Arquivo de texto misturando Markdown e JSX.
- **Processamento:** O compilador (usando bibliotecas como `remark` e `rehype`) converte o markdown em elementos HTML e preserva os componentes React.
- **Saída:** Um arquivo JavaScript que exporta uma função (o componente da página).

 **3. Classificação**

* **Não é framework:** Não dita a arquitetura da aplicação.
* **É uma ferramenta de pré-processamento:** Atua na camada de build.
* **Definição curta:** "Markdown para a era dos componentes".

No contexto do projeto `digital-garden`, o MDX atua como a **ponte de compilação** que transforma ensaios em código executável.

Para adicionar um novo texto, o autor deve criar um arquivo com a extensão `.mdx` dentro da pasta de idioma correspondente (exemplo: `content/essays/pt/novo-artigo.mdx`).

Todo arquivo deve iniciar obrigatoriamente com um bloco de metadados, delimitado por três traços (`---`). Este bloco define as informações que o sistema utiliza para listar e organizar o artigo. O corpo do texto segue logo abaixo, utilizando a formatação padrão de Markdown.

Tecnicamente, o MDX não é um framework, nem apenas uma especificação isolada. A definição mais precisa é que o MDX é um **formato de autoria** (authoring format) e uma **extensão de sintaxe**.



**Exemplo de estrutura de arquivo:**

```markdown
---
title: O Título do Artigo
description: Uma breve descrição que aparecerá nas listagens.
date: 2024-01-04
published: true
---

# Introdução

Este é o início do texto do artigo. Para criar parágrafos, basta deixar uma linha em branco.

## Subtítulo

Listas podem ser criadas assim:
- Item um
- Item dois

Para enfatizar texto, usa-se **negrito** ou *itálico*.

```

### 2. Especificações Técnicas e Recursos Avançados

O motor MDX permite funcionalidades estendidas para documentação técnica, notação científica e interatividade. Abaixo estão as diretrizes para utilização desses recursos.

#### Notação Matemática (LaTeX)

O sistema processa sintaxe LaTeX para renderização de fórmulas matemáticas.

* **Inline:** Utilize um único cifrão `$` para equações na mesma linha.
* Exemplo: A energia é dada por .


* **Bloco:** Utilize cifrão duplo `$$` para equações centralizadas e destacadas.
* Exemplo:




#### Blocos de Código

Para inserir trechos de código com realce de sintaxe (syntax highlighting), utilize três crases seguidas do nome da linguagem.

```python
def atrator_lorenz(x, y, z):
    # Lógica da simulação
    return x + y

```

#### Componentes Interativos (Simulações)

Diferente de arquivos Markdown estáticos, o formato MDX suporta a importação e execução de componentes React. Isso é utilizado para inserir as simulações físicas diretamente no fluxo de leitura.

Os componentes devem ser importados no topo do arquivo (após o bloco de metadados) ou estar registrados globalmente no `mdx-components.tsx`.

**Exemplo de uso:**

```jsx
import { ChaosPendulum } from '@/components/simulations/chaos-pendulum/ChaosPendulum'

Aqui discutimos a teoria do caos e a sensibilidade às condições iniciais. Observe a simulação abaixo:

<ChaosPendulum gravity={9.81} length={200} />

A variação na trajetória demonstra o comportamento caótico.

```
