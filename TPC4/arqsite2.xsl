<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="2.0">
    
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    
    <xsl:template match="/">
        <xsl:result-document href="site/index.html">
            <html>
                <head>
                    <title>
                        Arqueossítios do NW Português
                    </title>
                </head>
                <body>
                    <h3>
                        Índice de arqueossítios
                    </h3>
                    <ul>
                        <xsl:apply-templates select="//ARQELEM">
                            <xsl:sort select="CONCEL"/>
                        </xsl:apply-templates>
                    </ul>
                </body>
            </html>
        </xsl:result-document>
    </xsl:template>
    
    <xsl:template match="ARQELEM">
        <li>
            <xsl:value-of select="CONCEL"/>
        </li>
    </xsl:template>
    
</xsl:stylesheet>