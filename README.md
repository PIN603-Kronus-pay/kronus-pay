# KronosPay

Sistema de gestão de pagamentos para funcionários, desenvolvido com React e Vite. A aplicação centraliza o controle de pedidos, pagamentos, cadastro de funcionários e geração de relatórios em uma interface web simples e direta.

## Funcionalidades

- Dashboard com visão geral do sistema
- Gestão de pagamentos e histórico de transações
- Listagem e cadastro de funcionários
- Acompanhamento de pedidos (novos, em produção, concluídos)
- Geração de relatórios

## Tecnologias

- TypeScript
- Tailwind CSS 4


## Pré-requisitos

- Node.js 18 ou superior
- pnpm (recomendado) ou npm

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/kronus-pay.git
cd kronus-pay
pnpm install
```

## Rodando o projeto

Para iniciar o servidor de desenvolvimento:

```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`.

Para gerar o build de produção:

```bash
pnpm build
```

## Estrutura do projeto

```
src/
  app/
    components/
      ui/          # Componentes base (shadcn/ui)
      figma/       # Componentes auxiliares gerados via Figma
      Dashboard.tsx
      Payments.tsx
      PaymentsList.tsx
      EmployeesList.tsx
      AddEmployeeForm.tsx
      NewOrderForm.tsx
      OrderCard.tsx
      Reports.tsx
      Sidebar.tsx
      Layout.tsx
      ...
    App.tsx
```

## Origem do design

O layout foi baseado no arquivo Figma [Gestão De Pagamentos para Funcionarios](https://www.figma.com/design/IidTHuyvyJhEiOWGfqXqw5).
