# PT-BR 🇧🇷


# Infraestrutura

Para solução do desafio proposto segui a arquitetura de microserviços com a utilização do pattern SAGA.
Os principais beneficios da arquitetura de microserviços para este problema é o ganho na escalabilidade, monitoramento e manunteção a longo prazo. Os microserviços só poderão ser utilizados na rede interna, usando como paralelismo uma infraestrutura AWS os microserviços só poderiam ser consultados dentro da VPC.
A utilização do pattern SAGA traz o beneficio não só de confiabilidade durante o pipeline do processamento de pagamento como também escalabilidade por todos processamento ser executado por eventos. Há um ganho significado na complexidade da aplicação quando utilizado em uma aplicação ainda pequena, que é o caso do desafio. Para comunicação entre os microserviços foi utilizado o message broker RabbitMQ. O ganho de velocidade deste protocolo ao invés do http traz ganhos significativos em performance da aplicação conforme escala.

Foi adicionado um serviço de api-gateway no qual expoe dois endpoints http para ser consumido pelo usuario final.
Cada serviço possui o seu proprio banco de dados. A confiabilidade de pesistencia de dados é dada ao uso do SAGA.

Sugestão de solução na cloud:

![Microservices architecture](docs/images/architecture-diagram.png#center)


## Entity relationship diagram

*Apenas é salvo os ultimos 4 digitos do cartão do usuario no banco de dados. Os dados necessários para o processamento do pagamento é trafegado pelo massage broker.

![ERD](docs/images/erd.png#center)


## Como executar
```
docker compose up -d
```

Swagger disponível em
https://localhost:3000/docs#


### TO DO

- Testes unitários
- Funcionalidade de rollback em caso de falhas no pipeline no saga
- melhor abstração das camadas de comunicação com message broker
- Adição de cache
