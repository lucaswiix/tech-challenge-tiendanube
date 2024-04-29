# PT-BR 🇧🇷

Desafio desenvolvido em curto prazo de tmepo por demandas no trabalho atual, com isso foi necessário adiar alguns processos com o objetivo de entregar o desafio. No caso do saga os testes são mais complexos pois necessita a implementação de mocks de toda camada de dominio assim como a camada responsavel pela manipulação de eventos (com rxjs).


```
id: 8e33fb74-8bdb-4f38-9f64-ca56c3051fa5
name: Jhon Smith
documentId: 1112223334455
```

## Patterns

Para melhor abstração da aplicação e consequencimento legibilidade para a condicional do modo de pagamento na entidade payable foi utilizado o abstract factory.
Para (não só) confiabilidade do pipeline durante o processo de pagamento entre os microserviços e pelo ganho em escalabilidade foi utilizado o pattern SAGA (não completo).
Os services assim como events handler e commands (no caso do saga) são utilizados como camada de dominio. 
Os endpoints estão respeitando o padrão restful.

```
POST /merchants/:id/transactions
GET /merchants/:id/payables?page=1&limit=10&start_date=xxxx-xx-xx&end_date=xxxx-xx-xx
```


## Infraestrutura

Para solução do desafio proposto segui a arquitetura de microserviços com a utilização do pattern SAGA.

Os principais beneficios da arquitetura de microserviços para este problema é o ganho na escalabilidade, monitoramento e manunteção a longo prazo. Os microserviços só poderão ser utilizados na rede interna, usando como paralelismo uma infraestrutura AWS os microserviços só poderiam ser consultados dentro da VPC.

A utilização do pattern SAGA traz o beneficio não só de confiabilidade durante o pipeline do processamento de pagamento como também escalabilidade por todos processamentos serem executados por eventos.
Há um ganho significado na complexidade da aplicação quando utilizado SAGA, que é o caso do desafio. Para comunicação entre os microserviços foi utilizado o message broker RabbitMQ. O ganho de velocidade do protocolo AMQP ao invés do http traz ganhos significativos em performance da aplicação conforme escala.

Foi adicionado um serviço de api-gateway no qual expoe dois endpoints http para ser consumido pelo usuario final.
Cada serviço possui o seu proprio banco de dados. A confiabilidade de pesistencia de dados é dada ao uso do SAGA.

Sugestão de solução na cloud:

![Microservices architecture](docs/images/architecture-diagram.png#center)


## Entity relationship diagram

Utilizado o banco de dados relacional postgres.

*Apenas é salvo os ultimos 4 digitos do cartão do usuario no banco de dados. Os dados necessários para o processamento do pagamento é trafegado pelo massage broker.

![ERD](docs/images/erd.png#center)

Para facilitar a demostração é criado de maneira automatica um merchant

```
id: 8e33fb74-8bdb-4f38-9f64-ca56c3051fa5
name: Jhon Smith
documentId: 1112223334455
```


## Como executar
```
docker compose up -d
```

Swagger disponível em
https://localhost:3000/docs#

## Executar os testes

```
npm run test
```
ou para executar os testes com coverage
```
npm run test:cov
```


## TO DO

- Cobertura de Testes unitários nos metodos saga
- Monitoramento/Observabilidade/LogStash
- Funcionalidade de rollback em caso de falhas no pipeline no saga
- Melhor abstração das camadas de comunicação com message broker
- Adição de cache
