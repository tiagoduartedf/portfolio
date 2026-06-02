# msg broker

intermediador de msgs
servidor de mensageria asyncrono

# produto -> rabbitMQ -> consumidor

- produtor
envia msg

- consumidor
recebe a msg

# fila/queue
locais onde as msgs estão armazenadas
buffer definido, duraveis ou n (pra ser persistidas em disco)
n fica em memoria ate o servidor ser parado

# mensagem/payload
texto puro, arquivo de midia como pdf
em bytes
todas as msgs antes de chegar numa fila passam por uma `exchange/troca`

- nome da fila
- nome da troca

# troca/exchange
recebe a msg e determina pra qual fila essa msg vai ser encaminhada
5 tipos
- default (publica uma msg sem especificar)
- fanout
- direct
- topic
- header