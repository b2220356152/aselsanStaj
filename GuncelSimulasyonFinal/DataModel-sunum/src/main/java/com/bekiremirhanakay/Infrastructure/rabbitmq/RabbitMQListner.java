package com.bekiremirhanakay.Infrastructure.rabbitmq;

import com.bekiremirhanakay.Application.Config.IConfigProvider;
import com.bekiremirhanakay.Application.Data.IEventPublisher;
import com.bekiremirhanakay.Application.Data.IRepository;
import com.bekiremirhanakay.FrontendApplication;
import com.bekiremirhanakay.Infrastructure.Config.BeanConfigProvider;
import com.bekiremirhanakay.Infrastructure.dto.ConnectionData;
import com.bekiremirhanakay.Infrastructure.dto.MessageDto;
import com.bekiremirhanakay.Infrastructure.mongo.RepositoryCSV;
import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.rabbitmq.client.AMQP;
import com.rabbitmq.client.DefaultConsumer;
import com.rabbitmq.client.Envelope;
import org.bson.Document;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

@Service
public class RabbitMQListner implements MessageListener {
 	IRepository repo = new RepositoryCSV();
	private SimpMessagingTemplate messagingTemplate;
	private boolean disableMode = false;

	private IEventPublisher queueCommand,queueQueryReply,queueQuery,queueXmlProvider,queueCsvProvider,queuePortProvider,queueXml,queueCsv,queuePort ;
	private ArrayList<Document> processedResult = null;

	private IConfigProvider configApp= new BeanConfigProvider();
	IEventPublisher queue = (IEventPublisher) configApp.getValue("FrontendConfigFile","queueType");
	private IEventPublisher queueConnect = (IEventPublisher) queue.clone();

	@Autowired
	public RabbitMQListner(SimpMessagingTemplate messagingTemplate) throws CloneNotSupportedException {
		this.messagingTemplate = messagingTemplate;
		queueConnect.create("connect");
		queueCommand = (IEventPublisher) queue.clone();
		queueQueryReply = (IEventPublisher) queue.clone();
		queueQuery = (IEventPublisher) queue.clone();
		queueXmlProvider = (IEventPublisher) queue.clone();
		queueCsvProvider = (IEventPublisher) queue.clone();
		queuePortProvider = (IEventPublisher) queue.clone();
		queueXml = (IEventPublisher) queue.clone();
		queueCsv = (IEventPublisher) queue.clone();
		queuePort = (IEventPublisher) queue.clone();
	System.out.println("*******************************************************************");
		repo.deleteAll();
		queueCommand.create("CommandQueue2");
		queueQueryReply.create("QueryReplyQueue");
		queueXmlProvider.create("DataProviderXml");
		queueCsvProvider.create("DataProviderCsv");
		queuePortProvider.create("DataProviderPort");
		queueCsv.create("CsvQueue2");
		queueXml.create("XmlQueue2");
		queuePort.create("PortQueue2");
		queueQueryReply.create("QueryReplyQueue");
		queueQuery.create("QueryQueue");


	}
	@RabbitListener(queues="CommandQueue2", exclusive = true)
	public void onCommand(Message message) {
		String data = new String(message.getBody());
		if(data.equals("replay")){
			disableMode=false;
		}else{
			disableMode=true;
		}
	}
	@RabbitListener(queues="QueryQueue", exclusive = true)
	public void onQuery(Message message) throws IOException, InterruptedException {
		String data = new String(message.getBody());
		System.out.println(data);

		FindIterable<Document> result = repo.select(new BasicDBObject("FlightId", data));
		processedResult = result.into(new ArrayList<Document>());

	}

	@RabbitListener(queues="QueryReplyQueue", exclusive = true)
	public void onQueryReply(Message message) throws InterruptedException {
		String data = new String(message.getBody());


		System.out.println("Consuming Message to query - " + new String(message.getBody()));
		String[] row = data.split(":");
		MessageDto dto = new MessageDto();
		System.out.println(row[1]);
		dto.setId(row[1]);
		dto.setLat(row[3]);
		dto.setLng(row[5]);
		dto.setVelocity(row[7]);
		dto.setType(row[9]);
		dto.setStatus(row[11]);
		dto.setDataType(row[13]);
		dto.setDevice(row[15]);
		messagingTemplate.convertAndSend("/topic/query", dto);
	}

	@RabbitListener(queues="DataProviderXml", exclusive = true)
	public void onMessageXml(Message message) {
		try {
			String data = new String(message.getBody(), "UTF-8");
			String[] row = data.split(":");
			List<String> rowList = Arrays.asList(row);
			ArrayList<String> rowData = new ArrayList<String>(rowList);
			String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new java.util.Date());
			rowData.add("Creation Time");
			rowData.add(timeStamp);
			rowData.add("Last Modification Time");
			rowData.add(timeStamp);

			Document document = repo.addRow(rowData);
			Thread.sleep(1);
			if (!(document == null)){
			}
			else
				System.out.println("Error entry cannot inserted to database");
			//System.out.println("Consumed: " + message);
			System.out.println("Consuming Message - " + new String(message.getBody()));
			if(!disableMode){
				queueXml.publish(new String(message.getBody()));
			}


		} catch (UnsupportedEncodingException | InterruptedException e) {
			e.printStackTrace();
		}

	}

	@RabbitListener(queues="XmlQueue2", exclusive = true)
	public void onMessageXmlSender(Message message) {
		try{
			String data = new String(message.getBody());


			System.out.println("Consuming Message to xml - " + new String(message.getBody()));
			String[] row = data.split(":");
			MessageDto dto = new MessageDto();
			System.out.println(row[1]);
			dto.setId(row[1]);
			dto.setLat(row[3]);
			dto.setLng(row[5]);
			dto.setVelocity(row[7]);
			dto.setType(row[9]);
			dto.setStatus(row[11]);
			dto.setDataType(row[13]);
			dto.setDevice(row[15]);
			messagingTemplate.convertAndSend("/topic/xml", dto);
		}catch (Exception e){
			e.printStackTrace();
		}

	}




	@RabbitListener(queues="DataProviderCsv", exclusive = true)
	public void onMessageCsv(Message message) {
		try {
			String data = new String(message.getBody(), "UTF-8");
			String[] row = data.split(":");
			List<String> rowList = Arrays.asList(row);
			ArrayList<String> rowData = new ArrayList<String>(rowList);


			Document document = repo.addRow(rowData);
			Thread.sleep(1);
			if (!(document == null)){
			}
			else
				System.out.println("Error entry cannot inserted to database");
			//System.out.println("Consumed: " + message);
			System.out.println("Consuming Message - " + new String(message.getBody()));
			if(!disableMode){
				queueCsv.publish(new String(message.getBody()));
			}


		} catch (UnsupportedEncodingException | InterruptedException e) {
			e.printStackTrace();
		}

	}

	@RabbitListener(queues="CsvQueue2", exclusive = true)
	public void onMessageCsvSender(Message message) {
		try{
			String data = new String(message.getBody());


			System.out.println("Consuming Message to csv - " + new String(message.getBody()));
			String[] row = data.split(":");
			MessageDto dto = new MessageDto();
			System.out.println(row[1]);
			dto.setId(row[1]);
			dto.setLat(row[3]);
			dto.setLng(row[5]);
			dto.setVelocity(row[7]);
			dto.setType(row[9]);
			dto.setStatus(row[11]);
			dto.setDataType(row[13]);
			dto.setDevice(row[15]);
			messagingTemplate.convertAndSend("/topic/csv", dto);
		}catch (Exception e){
			e.printStackTrace();
		}

	}


	@RabbitListener(queues="DataProviderPort", exclusive = true)
	public void onMessagePort(Message message) {
		try {
			String data = new String(message.getBody(), "UTF-8");
			String[] row = data.split(":");
			List<String> rowList = Arrays.asList(row);
			ArrayList<String> rowData = new ArrayList<String>(rowList);
			Document document = repo.addRow(rowData);
			if (!(document == null)){
			}
			else
				System.out.println("Error entry cannot inserted to database");
			System.out.println("Consuming Message to port- " + new String(message.getBody()));
			if(!disableMode){
				queuePort.publish(new String(message.getBody()));
			}

		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		}
	}



	@RabbitListener(queues="PortQueue2", exclusive = true)
	public void onMessagePortSender(Message message) {
		try{
			String data = new String(message.getBody());


			System.out.println("Consuming Message ->>" + new String(message.getBody()));
			String[] row = data.split(":");
			MessageDto dto = new MessageDto();

			dto.setId(row[1]);
			dto.setLat(row[3]);
			dto.setLng(row[5]);
			dto.setVelocity(row[7]);
			dto.setType(row[9]);
			dto.setStatus(row[11]);
			dto.setDataType(row[13]);
			dto.setDevice(row[15]);
			messagingTemplate.convertAndSend("/topic/port", dto);
		}catch (Exception e){
			e.printStackTrace();
		}

	}



	@PostMapping("/ws/connect-req")
	@RabbitListener(queues="connect", exclusive = false)
	public void onMessageConnect(Message message) {
		//System.out.println(messagingTemplate);
		try {
			String data = new String(message.getBody());
			System.out.println("Consuming Message - " + new String(message.getBody()));
			String[] row = data.split(":");

			ConnectionData connectionData = new ConnectionData();
				connectionData.setDataType(row[0]);
				connectionData.setDeviceID(row[1]);




				messagingTemplate.convertAndSend("/topic/connect-req", connectionData);
				System.out.println(connectionData.getDataType());
			}
		catch (Exception e) {

		}
	}





	@Scheduled(fixedDelay = 100)
	public void send(){
	if(processedResult!=null && processedResult.size()>0){
		String sendString ="";
		Document document = processedResult.get(0);
		Set<String> keys = document.keySet();
		keys.remove("_id");
		for (String key : keys) {
			sendString+=key + ":" +document.get((Object) key) + ":";
		}
		System.out.println(sendString);
		processedResult.remove(0);
		queueQueryReply.publish(sendString);
	}
	}
























	@Override
	public void onMessage(Message message) {

	}
}
