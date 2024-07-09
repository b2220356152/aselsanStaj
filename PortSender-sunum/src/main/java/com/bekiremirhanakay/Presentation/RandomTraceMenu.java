package com.bekiremirhanakay.Presentation;

import com.bekiremirhanakay.Core.DataSender;
import com.bekiremirhanakay.Infrastructure.dto.TraceData;

import javax.swing.*;
import javax.swing.border.BevelBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Locale;
import java.util.Random;

public class RandomTraceMenu {
    private TraceData data;
    private JLabel lblMotionInfo,lblFreqInfo,lblTraceInfo,lblTraceAmount,lblFID,lblAmount,lblfreq,lblLat,lblType, lblLng,lblVelocity,lblStatus;
    private JTextField txtTraceAmount,txtFID,txtAmount,txtfreq,txtLat,txtLng, txtVelocity;
    private JComboBox<String> txtType;
    private JComboBox<String> txtStatus;
    private JButton generateButton;
    private TraceData traceData;
    private MainMenu mainMenu;

    public RandomTraceMenu(){
        JFrame frame = new JFrame("Random Track Generator");
        Color color=new Color(255, 239 ,213);
        frame.getContentPane().setBackground(color);
        frame.setSize(700, 400); // 400 width and 500 height
        frame.setLayout(null); // using no layout managers
        frame.setVisible(true);

        lblTraceAmount= new JLabel("Track Amount");
        lblTraceAmount.setBounds(200,2,100,50);
        txtTraceAmount = new JTextField();
        txtTraceAmount.setText("20");
        txtTraceAmount.setBounds(300,10,100,30);
        lblTraceInfo = new JLabel("<html>Enter number of track<br/>to be generated.</html>");
        lblTraceAmount.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                lblTraceInfo.setBounds(80,5,120,50);
                lblTraceInfo.setOpaque(true);
                lblTraceInfo.setBackground(Color.WHITE);
                lblTraceInfo.setVisible(true);

            }
            public void mouseExited(MouseEvent evt) {
                lblTraceInfo.setVisible(false);
                lblTraceInfo.setBounds(50,185,150,80);
                //lblMotionInfo.setForeground(new Color(0, 0, 0, 1));
            }
        });

        lblFID= new JLabel("TrackID");
        lblFID.setBounds(50,30,100,80);
        txtFID = new JTextField();
        txtFID.setText("10");
        txtFID.setBounds(150,55,100,30);




        lblLat= new JLabel("Start Latitude");
        lblLat.setBounds(50,70,100,80);
        txtLat = new JTextField();
        txtLat.setText("39.74");
        txtLat.setBounds(150,95,100,30);



        String[] typeChoices = { "FIXED WING","MISSILE", "ROTATING WING","ROCKET","UAV","UNKNOWN","SEA SKIMMING","LEAVING"};
        lblType= new JLabel("Type");
        lblType.setBounds(50,110,100,80);
        txtType = new JComboBox<String>(typeChoices);
        txtType.setBounds(150,135,100,30);


        lblLng = new JLabel("Start Longitude");
        lblLng.setBounds(350,30,100,80);
        txtLng = new JTextField();
        txtLng.setText("32.96");
        txtLng.setBounds(450,55,100,30);


        lblVelocity = new JLabel("Velocity");
        lblVelocity.setBounds(350,70,100,80);
        txtVelocity = new JTextField();
        txtVelocity.setText("2354");
        txtVelocity.setBounds(450,95,100,30);




        String[] statusChoices = { "UNKNOWN","PENDING", "ENEMY","FRIEND"};
        lblStatus= new JLabel("Status");
        lblStatus.setBounds(350,110,100,80);
        txtStatus = new JComboBox<String>(statusChoices);
        txtStatus.setBounds(450,135,100,30);



        lblAmount= new JLabel("Motion Amount");
        lblAmount.setBounds(50,165,100,80);
        txtAmount = new JTextField();
        txtAmount.setBounds(160,190,100,30);
        txtAmount.setText("100");
        lblMotionInfo = new JLabel("<html>Enter number of motion<br/>for each track.</html>");

        lblAmount.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                lblMotionInfo.setBounds(50,220,100,60);
                lblMotionInfo.setOpaque(true);
                lblMotionInfo.setBackground(Color.WHITE);
                lblMotionInfo.setVisible(true);

            }
            public void mouseExited(MouseEvent evt) {
                lblMotionInfo.setVisible(false);
                lblMotionInfo.setBounds(50,185,150,80);
                //lblMotionInfo.setForeground(new Color(0, 0, 0, 1));
            }
        });


        lblfreq= new JLabel("Frequency(ms)");
        lblfreq.setBounds(350,165,100,80);

        lblFreqInfo = new JLabel("<html>Enter time frequency of  <br/>generated data.</html>");
        lblfreq.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                lblFreqInfo.setBounds(560,185,120,50);
                lblFreqInfo.setOpaque(true);
                lblFreqInfo.setBackground(Color.WHITE);
                lblFreqInfo.setVisible(true);

            }
            public void mouseExited(MouseEvent evt) {
                lblFreqInfo.setVisible(false);
                lblFreqInfo.setBounds(50,185,150,80);
            }
        });


        txtfreq = new JTextField();
        txtfreq.setText("2000");
        txtfreq.setBounds(460,190,100,30);

        generateButton = new JButton("Generate");
        generateButton.setBorder(new BevelBorder(10));
        generateButton.setBounds(190, 230, 220, 50); // x axis, y axis, width, height

        generateButton.addActionListener(new ActionListener() {

            @Override
            public void actionPerformed(ActionEvent e) {
                String lat = txtLat.getText();
                String lng = txtLng.getText();
                int ids = Integer.parseInt(txtFID.getText());
                int[] constant = new int[]{1,-1};
                ArrayList<ArrayList<String>> markers = new ArrayList<>();
                for(int t =0;t<Integer.parseInt(txtTraceAmount.getText());t++){
                    ArrayList<String> temp = new ArrayList<>();
                    temp.add(lat);
                    temp.add(lng);
                    markers.add(temp);
                }
                for(int i=0;i<Integer.parseInt(txtAmount.getText());i++){

                    for(int t =0;t<Integer.parseInt(txtTraceAmount.getText());t++){
                        int idParser = ids + t;

                        double value =  ((double)Math.random())/20 *getRandom(constant);;
                        System.out.println("lat : " + lat + " lng : " + lng + " value = " + value);
                        double temp = Double.parseDouble(markers.get(t).get(0)) + value;
                        markers.get(t).set(0,String.format(Locale.US,"%.2f",temp));
                        value =  ((double)Math.random())/20 *getRandom(constant);

                        temp = Double.parseDouble(markers.get(t).get(1)) + value;
                        markers.get(t).set(1,String.format(Locale.US,"%.2f",temp));
                        System.out.println("lat : " + markers.get(t).get(0) + " lng : " + markers.get(t).get(1) + " value = " + value);
                        data = new TraceData();
                        data.setDeviceID("A205");
                        data.setFlightID(String.valueOf(idParser));
                        data.setLatitude(markers.get(t).get(0));
                        data.setLongitude(markers.get(t).get(1));
                        data.setVelocity(txtVelocity.getText());
                        data.setType(txtType.getSelectedItem().toString());
                        data.setDataType("Track");
                        data.setStatus(txtStatus.getSelectedItem().toString());
                        try {
                            DataSender.sendWithExternal(data);
                        } catch (IOException ex) {
                            //throw new RuntimeException(ex);
                        }

                    }

                    try {
                        Thread.sleep(Long.parseLong(txtfreq.getText()));
                    } catch (InterruptedException ex) {
                        throw new RuntimeException(ex);
                    }

                    }

            }

        });



        frame.add(lblTraceAmount);
        frame.add(txtTraceAmount);

        frame.add(lblFID);
        frame.add(txtFID);

        frame.add(lblLng);
        frame.add(txtLng);

        frame.add(lblLat);
        frame.add(txtLat);

        frame.add(lblVelocity);
        frame.add(txtVelocity);

        frame.add(lblAmount);
        frame.add(txtAmount);

        frame.add(lblType);
        frame.add(txtType);

        frame.add(lblStatus);
        frame.add(txtStatus);
        frame.add(generateButton);
        frame.add(lblfreq);
        frame.add(txtfreq);

        frame.add(lblMotionInfo);
        frame.add(lblTraceInfo);
        frame.add(lblFreqInfo);
        lblFreqInfo.setVisible(false);
        lblMotionInfo.setVisible(false);
        lblTraceInfo.setVisible(false);

    }
    public static int getRandom(int[] array) {
        int rnd = new Random().nextInt(array.length);
        return array[rnd];
    }
    public MainMenu getMainMenu() {
        return mainMenu;
    }

    public void setMainMenu(MainMenu mainMenu) {
        this.mainMenu = mainMenu;
    }
}
