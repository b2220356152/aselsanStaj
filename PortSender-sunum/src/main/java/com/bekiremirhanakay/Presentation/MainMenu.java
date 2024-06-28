package com.bekiremirhanakay.Presentation;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import javax.swing.border.BevelBorder;
import java.awt.event.ActionListener;

public class MainMenu {

    private TraceData data;
    private JLabel lblFID;
    private JTextField txtFID;
    private JLabel lblLat;
    private JTextField txtLat;
    private JLabel lblType;
    private JComboBox<String> txtType;
    private JLabel lblLng;
    private JTextField txtLng;
    private JLabel lblVelocity;
    private JTextField txtVelocity;
    private JLabel lblStatus;
    private JComboBox<String> txtStatus;
    private JButton sendButton;
    private JButton randButton;
    private JTable table;
    private JScrollPane scrollPane;
    private JPanel panel;
    private TraceData traceData;
    private boolean isClosed;
    public MainMenu(){
        JFrame frame = new JFrame("Track Simulator");
        Color color=new Color(255, 239 ,213);
        frame.getContentPane().setBackground(color);
        this.isClosed = false;
        lblFID= new JLabel("TrackID");
        lblFID.setBounds(50,30,100,80);
        txtFID = new JTextField();
        txtFID.setBounds(150,55,100,30);


        lblLat= new JLabel("Latitude");
        lblLat.setBounds(50,70,100,80);
        txtLat = new JTextField();
        txtLat.setBounds(150,95,100,30);



        String[] typeChoices = { "FIXED WING","MISSILE", "ROTATING WING","ROCKET","UAV","UNKNOWN","SEA SKIMMING","LEAVING"};
        lblType= new JLabel("Type");
        lblType.setBounds(50,110,100,80);
        txtType = new JComboBox<String>(typeChoices);
        txtType.setBounds(150,135,100,30);


        lblLng = new JLabel("Longitude");
        lblLng.setBounds(350,30,100,80);
        txtLng = new JTextField();
        txtLng.setBounds(450,55,100,30);


        lblVelocity = new JLabel("Velocity");
        lblVelocity.setBounds(350,70,100,80);
        txtVelocity = new JTextField();
        txtVelocity.setBounds(450,95,100,30);



        String[] statusChoices = { "UNKNOWN","PENDING", "ENEMY","FRIEND"};
        lblStatus= new JLabel("Status");
        lblStatus.setBounds(350,110,100,80);
        txtStatus = new JComboBox<String>(statusChoices);
        txtStatus.setBounds(450,135,100,30);


        String[] columnNames = { "Flight ID", "Latitude", "Longitude","Type","Velocity","Status" };
        String[][] columns = {

        };
        DefaultTableModel model = new DefaultTableModel(columnNames,0);
        setTable(new JTable(model));
        getTable().setBounds(100, 300, 300,
                300);
        scrollPane = new JScrollPane(getTable());

        panel = new JPanel();
        panel.setBounds(100, 300, 500,
                300);
        panel.add(scrollPane);

        sendButton = new JButton("Send");
        sendButton.setBorder(new BevelBorder(10));

        sendButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {

                DefaultTableModel model = (DefaultTableModel) getTable().getModel();
                boolean isInserted = false;
                System.out.println(model.getRowCount());
                for (int i = 0; i < model.getRowCount(); i++){
                    if(txtFID.getText().equals(model.getValueAt(i, 0))){
                        isInserted=true;
                        model.setValueAt(txtLat.getText(), i, 1);
                        model.setValueAt(txtLng.getText(), i, 2);
                        model.setValueAt(txtType.getSelectedItem().toString(), i, 3);
                        model.setValueAt(txtVelocity.getText(), i, 4);
                        model.setValueAt(txtStatus.getSelectedItem().toString(), i, 5);

                    }
                }
                if(isInserted==false){
                    model.addRow(new Object[]{txtFID.getText(), txtLat.getText(), txtLng.getText(),txtType.getSelectedItem().toString(),txtVelocity.getText(),txtStatus.getSelectedItem().toString()});
                    System.out.println(model.getRowCount());
                    System.out.println(model.getColumnCount());
                }

                getTable().setModel(model);
                setData(new TraceData());
                getData().setDeviceID("A205");
                getData().setFlightID(txtFID.getText());
                getData().setLatitude(txtLat.getText());
                getData().setLongitude(txtLng.getText());
                getData().setVelocity(txtVelocity.getText());
                getData().setType(txtType.getSelectedItem().toString());
                getData().setDataType("Track");
                getData().setStatus(txtStatus.getSelectedItem().toString());

            }
        });

        sendButton.setBounds(100, 200, 220, 50); // x axis, y axis, width, height

        frame.addWindowListener(new java.awt.event.WindowAdapter() {
                    @Override
                    public void windowClosing(java.awt.event.WindowEvent windowEvent) {
                        isClosed=true;
                        //System.exit(0);
                    }
        });

        frame.add(sendButton); // adding button in JFrame
        frame.add(lblFID);
        frame.add(txtFID);

        frame.add(lblLng);
        frame.add(txtLng);

        frame.add(lblLat);
        frame.add(txtLat);

        frame.add(lblVelocity);
        frame.add(txtVelocity);

        frame.add(lblType);
        frame.add(txtType);

        frame.add(lblStatus);
        frame.add(txtStatus);
        frame.add(panel);


        randButton = new JButton("Create random trace data");
        randButton.setBorder(new BevelBorder(10));
        randButton.setBounds(380, 200, 220, 50);

        randButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                RandomTraceMenu randomTraceMenu = new RandomTraceMenu();
                randomTraceMenu.setMainMenu(MainMenu.this);



            }
        });



        frame.add(randButton);


        frame.setSize(700, 700); // 400 width and 500 height
        frame.setLayout(null); // using no layout managers
        frame.setVisible(true);
    }

    public TraceData getData(){
        TraceData temp = data;
        return temp;
    }

    public boolean isClosed() {
        return isClosed;
    }

    public JTable getTable() {
        return table;
    }

    public void setTable(JTable table) {
        this.table = table;
    }

    public void setData(TraceData data) {
        this.data = data;
    }
}
