package com.bekiremirhanakay;

import com.bekiremirhanakay.Core.DataSender;
import com.bekiremirhanakay.Presentation.MainMenu;
import java.io.IOException;


public class App 
{
    public static void main( String[] args ) throws IOException {
        MainMenu mainMenu = new MainMenu();
        DataSender dataSender = new DataSender(mainMenu);
        dataSender.open();
    }
}
